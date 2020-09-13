const express = require("express");
const app = express();
const path = require("path");
const articlesRouter = require("./routes/articles");

// Ejs for markdown
app.set("view engine", "ejs");


// add css
app.use(express.static(path.join(__dirname, "client")));

// home page
app.get("/", (req, res) => {
  const articles = [
    {
      title: "First Article",
      date: new Date(),
      description: "Deserunt deserunt magna dolor sunt culpa reprehenderit.",
    },
    {
      title: "Second Article",
      date: new Date(),
      description: "Deserunt deserunt magna dolor sunt culpa reprehenderit.",
    },
    {
      title: "Another Article",
      date: new Date(),
      description: "Deserunt deserunt magna dolor sunt culpa reprehenderit.",
    },
  ];
  res.render("articles/index.ejs", { articles: articles });
});

// about me section
app.get("/about", (req, res) => {
  res.send("About page");
});

app.use("/articles", articlesRouter);

app.listen(5000);
