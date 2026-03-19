import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const isAlreadyRegisterd = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isAlreadyRegisterd) {
    res.status(409).json({
      message: "username or email already existed",
    });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });
};
const token = jwt.sign({})
export { register };
