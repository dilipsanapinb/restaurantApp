const express = require("express");

const { User } = require("../models/user.model");

require('dotenv').config();

const bcrypt=require("bcrypt");

const jwt=require('jsonwebtoken')

const userRoute = express.Router();

userRoute.post("/api/register", async (req, res) => {
  let { name, email, password, address } = req.body;
  try {
    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        res.status(400).send({ Message: err.message });
        console.log(err);
      } else {
        let user = new User({ name, email, password: hash, address });
        await user.save();
        res
          .status(200)
          .send({ Message: "User registered successfully", "User": user });
      }
    });
  } catch (error) {
    console.log("Error in Register", error);
    res.status(500).send({ Message: error.Message });
  }
});

userRoute.post("/api/login", async (req, res) => {
    let { email, password } = req.body;
    let user = await User.findOne({ 'email': email });
    let hashPass = user.password;
    try {
        bcrypt.compare(password, hashPass, async function (err, result) {
            if (result) {
                var token = jwt.sign({ userID: user._id }, process.env.key);
                res.status(200).send({ "Message": "Login Successfull", 'token': token })
            } else {
                res.status(400).send({ "Message": err.Message });
                console.log(err);
            }
        });
    } catch (error) {
        console.log("Error in Login", error);
        res.status(500).send({ "Message": error.Message });
    }
});

userRoute.patch("/api/user/:id/reset",async (req, res) => {
    const id  = req.params.id;
    const { curr_pass, new_pass } = req.body;

    let hashPass = await bcrypt.hash(new_pass, 5);
    try {
        let user = await User.findByIdAndUpdate(
            { "_id": id },
            { "password": hashPass }
        );
        res.status(204).send({ "Message": "Password Updated Successfully" ,"User":user});
    } catch (error) {
        console.log("Error in Reset Password", error);
        res.status(500).send({ "Message": error.Message });
    }
    
});
module.exports={userRoute}