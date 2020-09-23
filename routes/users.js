require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Users = require("../models/user");
const passport = require("passport");
const { response } = require("express");
const { ensureAuthenticated } = require("../config/auth");

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", (req, res, next) => {
  console.log("recieved a login req");
  console.log(req.body.username);
  passport.authenticate("local", {
    successRedirect: "/users/admin/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Display dashboard
router.get("/admin/", ensureAuthenticated, (req, res) => {
  res.render("users/dashboard");
});

// Logout admin
router.get("/logout", (req, res) => {
  console.log("logout req");
  req.logout();
  req.flash("success_msg", "Logged out");
  res.redirect("/users/login");
});

module.exports = router;
