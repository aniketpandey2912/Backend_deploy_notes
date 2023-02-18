const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the user
 *        name:
 *          type: string
 *          description: The user name
 *        email:
 *          type: string
 *          description: The user email
 *        age:
 *          type: integer
 *          description: The user age
 *        pass:
 *          type: string
 *          description: The user password
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: All the APIs related to User
 */

/**
 * @swagger
 * /users:
 *  get:
 *    summary: This will get all data from the database
 *    tags: [Users]
 *    responses:
 *      200:
 *      description: A list of users
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: "#/components/schemas/User"
 */

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

/**
 * @swagger
 * /users/register:
 *  post:
 *    summary: To register a user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *    responses:
 *      200:
 *        description: User registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      500:
 *        description: Server error
 */

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

/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: To login a user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *    responses:
 *      200:
 *        description: User Login successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      500:
 *        description: Server error
 */

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
