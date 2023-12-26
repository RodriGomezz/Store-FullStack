import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { promisify } from "util";
dotenv.config();

export function generateToken(id) {
  const expiresIn = "3000";
  const token = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: expiresIn,
  });
  return { token, expiresIn };
}

export async function decodedToken(token) {
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    if (error.name == "JsonWebTokenError") console.log("Your token is invalid");
    if (error.name == "TokenExpiredError")
      console.log("Your token has been expired");
  }
}
