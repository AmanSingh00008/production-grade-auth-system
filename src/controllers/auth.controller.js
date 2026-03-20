import UserModel from "../models/user.model.js"
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isAlreadyRegistered = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isAlreadyRegistered) {
      return res.status(400).json({
        message: "username or email already existed",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(     
      { id: user._id },        
      config.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({       
      message: "user created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } 
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};
export { register, getMe };