const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const path = require("path");
// const file=require("../public/chat.html")
const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const findUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!findUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
      });
      user.save();
      return res.status(201).json({
        status: 201,
        message: "User registered succesfully",
        data: user,
      });
    } else {
      return res.status(400).json({
        staus: 400,
        message: "email addresss aleady exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!findUser) {
      return res.status(400).json({
        status: 400,
        message: "Register your self",
      });
    }
    const pass = await bcrypt.compare(password, findUser.password);
    if (!pass) {
      return res.status(400).json({
        status: 400,
        message: "invalid password",
      });
    }
    const token = await jsonWebToken.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const Ind = async (req, res) => {
  console.log("first");
  console.log(__dirname);
  return res.sendFile(
    "/Users/ztlab97/Prelearning_path/ExpressChat/public/index.html"
  );
};

module.exports = {
  Register,
  Login,
  Ind,
};
