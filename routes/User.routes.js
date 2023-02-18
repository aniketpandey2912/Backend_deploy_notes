const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, pass, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      try {
        const user = new UserModel({ name, email, pass: hash, age });
        await user.save();
        res.send({ msg: "Registered successfully" });
      } catch (err) {
        res.send({ msg: "Something went wrong", error: err.message });
      }
    });
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "shhhhh");
          res.send({ msg: "Login successfull", token: token });
        } else {
          res.send({ msg: "Wrong credentials" });
        }
      });
    } else {
      res.send({ msg: "User not found, register first" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

module.exports = { userRouter };
