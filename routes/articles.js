const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Article = require("../models/article");

// connect to db
mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add new article
router.get("/new", (req, res) => {
  res.render("articles/new");
});

router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

// Add New article
router.post("/", async (req, res) => {
  let article = new Article({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
  });
  try {
    article = await article.save();
    res.redirect(`articles/${article.id}`);
  } catch (e) {
    console.log("Error");
    res.render("articles/new", { article: article });
  }
});

module.exports = router;
