const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Article = require("../models/article");

// connect to db and managing deprecations
mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Add new article
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

// edit article
router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

// View an article
router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
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

    res.redirect(`articles/${article.slug}`);
  } catch (e) {
    console.log("Error");
    res.render("articles/new", { article: article });
  }
});

// deleting an article
router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
