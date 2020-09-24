const express = require("express");
const app = express();
const articlesRouter = require("./routes/articles");
const projectsRouter = require("./routes/projects");
const usersRouter = require("./routes/users");
const Article = require("./models/article");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const env = require("dotenv");
app.use(express.urlencoded({ extended: false }));

// passport config
require("./config/passport")(passport);

// Ejs for markdown
app.use(express.json());
app.set("view engine", "ejs");

// app.use(express.static(path.join(__dirname, "client")));
app.use(express.static(__dirname + "/client"));

app.use(methodOverride("_method"));

// Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database Connected"));

// home page
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ date: "desc" }); // Get all articles in the db
  res.render("articles/index.ejs", { articles: articles });
});

// about me section
app.get("/about", (req, res) => {
  res.render("about/about");
});

// articles api
app.use("/articles", articlesRouter);

// projects api
app.use("/projects", projectsRouter);

// user auth api
app.use("/users", usersRouter);

app.listen(5000, () => console.log("Server Started on port 5000"));
