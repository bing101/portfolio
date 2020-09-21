const express = require("express");
const bcrypt = require("bcrypt");
const { route } = require("./articles");
const router = express.Router();
const app = express();

const users = [];

router.get("/", (req, res) => {
  res.json(users);
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
    users.push(user);
    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

// Login user auth
router.post("/login/", async (req, res) => {
  let user = users.find((user) => user.username === req.body.username);

  if (user == null) return res.status(400).send("Cannot find user");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
