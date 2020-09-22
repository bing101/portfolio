require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Users = require("../models/user");
const user = require("../models/user");

// Middle ware function to verify token and grant access
const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get jwt from header

  if (token == null) return res.status(401).send("You do not have the access");
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Verification failed");
    req.user = user;
    next();
  });
};

router.get("/", authToken, (req, res) => {
  console.log(req.user); // user set by middleware

  res.status(200).send("Posts");
});

// Create a new user
// This will be removed in the fututre
router.post("/", async (req, res) => {
  const username = req.body.username;
  const pass = req.body.password;
  try {
    const salt = await bcrypt.genSalt(); // Generate salt
    const hash = await bcrypt.hash(pass, salt); // Hashed Password
    const user = {
      username: username,
      password: hash,
    };
    let users = new Users(user);
    users = await users.save();

    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get("/login/", (req, res) => {
  res.render("users/login");
});

// Login user auth
router.post("/login/", async (req, res) => {
  console.log("recieved login req");
  // let user = users.find((user) => user.username === req.body.username);
  let user = await Users.findOne({ username: req.body.username });
  if (user == null) return res.status(400).redirect("login");

  try {
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      res.send("Not Allowed");
    }
    const username = req.body.username;
    const userObj = { name: username };

    // creating jwt token
    const accessToken = jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET);
    res.send({ accessToken: accessToken });
  } catch (e) {
    console.log(e);
  }
});

module.exports = { router, authToken };
