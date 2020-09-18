const express = require("express");
const app = express();
const path = require("path");
const articlesRouter = require("./routes/articles");
const aboutRouter = require("./routes/about");
const Article = require("./models/article");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// Ejs for markdown
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "client")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// connect to db and managing deprecations
// Name of our database is blog
mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// home page
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ date: "desc" }); // Get all articles in the db
  res.render("articles/index.ejs", { articles: articles });
});

// about me section
app.use("/about", aboutRouter);
app.use("/articles", articlesRouter);

app.listen(5000, () => console.log("Server Started on port 5000"));
