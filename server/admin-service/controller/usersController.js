import user from "../models/user.js";
import Users from "../models/user.js";

export const getUsers = async (req, res) => {
  const users = await Users.find({});
  return res.status(200).json({ users });
};

export const deleteUser = async (req, res) => {
  const { _id } = req.body;
  await Users.deleteOne({ _id: _id });
};
