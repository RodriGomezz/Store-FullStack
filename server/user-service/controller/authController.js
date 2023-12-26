import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { generateToken, decodedToken } from "../helpers/token.js";
import catchAsync from "../helpers/catchAsync.js";
import sendEmail from "../utilities/email.js";
import crypto from "crypto";

export const signupCtrl = async (req, res) => {
  const newUser = await User.create(req.body);
  const token = generateToken(newUser._id);
  return res.status(200).json({ token });
};

export const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcryptjs.compareSync(password, user.password))
    return res.status(401).send("Wrong email or password");

  const { token, expiresIn } = generateToken(user._id);
  const role = user.role;
  const id = user.id;
  res.setHeader(
    "Set-Cookie",
    `token=${token}; secure; SameSite=None; HttpOnly`
  );
  return res.status(200).json({ token, expiresIn, role, email, id });
};

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(console.log("error"));
  }

  // verification token
  const decode = await decodedToken(token);

  // check if user still exists
  const freshUser = await User.findById(decode.id);
  if (!freshUser) return next(console.log("the user does not exist"));

  // check if user changed password
  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(console.log("user recently changed password"));
  }

  next();
});

export const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next("There is no user with email address", 404);
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.URL}/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordCOnfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res
      .status(200)
      .json({ status: "success", message: "Token sent to email!" });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      console.log("There was an error sending the email. Try again later!"),
      500
    );
  }
};

export const resetPassword = async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  // if token has not expired, and there is user, set the   new password
  if (!user) {
    return next("Token is invalid or has expired", 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  //log the user in, send JWT
  const token = generateToken(user._id);
  return res.status(200).json({ token });
};
