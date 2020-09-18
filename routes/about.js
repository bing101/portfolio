const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const About = require("../models/about");

console.log("about route");

// Add About
router.get("/", async (req, res) => {
  const about = await About.findOne();
  console.log("so far we foud these abouts");
  console.log(about);
  res.render("about/about", { about: about });
});

// Update about me section
router.get("/update", async (req, res) => {
  console.log("update about request");
  const about = await About.find();
  res.render("about/update", { about: about });
});

// Post
router.post("/update", async (req, res) => {
  console.log("post req recieved");
  let about = await About.find();
  console.log(req.body);
  // If the about section is empty
  if (about.length === 0) {
    console.log("does not exist creating");
    about = new About({
      markdown: req.body.markdown,
    });
    try {
      about = await about.save();
      console.log("About section is saved");
      res.redirect("/about");
    } catch (e) {
      console.log("error: ");
      console.log(e);
    }
  }
});

module.exports = router;
