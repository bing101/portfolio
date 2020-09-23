const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const { ensureAuthenticated } = require("../config/auth");

// A helper function for post and put req
const saveArticleAndRedirect = (path) => async (req, res) => {
  let article = req.article;

  article.title = req.body.title;
  article.description = req.body.description;
  article.markdown = req.body.markdown;

  try {
    article = await article.save();

    res.redirect("/");
  } catch (e) {
    res.render(`articles/${path}`, { article: article });
  }
};

// new articles
router.get("/new", ensureAuthenticated, (req, res) => {
  res.render("articles/new", { article: new Article() });
});

// edit article
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
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
router.post(
  "/",
  ensureAuthenticated,
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

// Edit article route
router.put(
  "/:id",
  ensureAuthenticated,
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

// deleting an article
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
