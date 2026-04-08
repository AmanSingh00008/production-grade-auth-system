import UserModel from "../models/user.model.js"
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

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

    const accessToken = jwt.sign(     
      { id: user._id },        
      config.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        {id: user._id},
        config.JWT_SECRET,
        {expiresIn: "7d"}


    )

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
      
  

    res.status(201).json({       
      message: "user created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      accessToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export async function getMe(req, res) {
  const token = req.headers.authorization?.split(" ") [1];

  if(!token){
    return res.status(401).json({
      message: "token is founded"
    })
  }

  const decoded = jwt.verify(token, config.JWT_SECRET);

  const user = await userModel.findById(decoded.id);
  res.status(200).json({
    message: "get user successfully",
    id: user._id,
    username: user.username,
    email: user.email,
  });
} 