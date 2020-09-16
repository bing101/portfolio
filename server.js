const express = require("express");
const app = express();
const path = require("path");
const articlesRouter = require("./routes/articles");
const Article = require("./models/article");

// Ejs for markdown
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "client")));
app.use(express.urlencoded({ extended: false }));

// home page
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ date: "desc" }); // Get all articles in the db
  res.render("articles/index.ejs", { articles: articles });
});

// about me section
app.get("/about", (req, res) => {
  res.send("About page");
});

app.use("/articles", articlesRouter);

app.listen(5000);
