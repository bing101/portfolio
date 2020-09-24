require("dotenv").config();

const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const Project = require("../models/projects");
const Users = require("../models/user");
const passport = require("passport");
const { response } = require("express");
const { ensureAuthenticated } = require("../config/auth");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/admin/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Display dashboard
router.get("/admin/", ensureAuthenticated, async (req, res) => {
  const articles = await Article.find().sort({ date: "desc" }); // Get all articles in the db
  res.render("users/dashboard", { articles: articles });
});

router.get("/admin/projects", ensureAuthenticated, async (req, res) => {
  let projects = await Project.find().sort({ date: "desc" });
  res.render("users/projects", { projects: projects });
});

// Logout admin
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out");
  res.redirect("/users/login");
});

module.exports = router;
