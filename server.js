const express = require("express");
const app = express();
const articlesRouter = require("./routes/articles");
const projectsRouter = require("./routes/projects");
const Article = require("./models/article");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// Ejs for markdown
app.set("view engine", "ejs");

// app.use(express.static(path.join(__dirname, "client")));
app.use(express.static(__dirname + "/client"));

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
app.get("/about", (req, res) => {
  res.render("about/about");
});
app.use("/articles", articlesRouter);
app.use("/projects", projectsRouter);

app.listen(5000, () => console.log("Server Started on port 5000"));
