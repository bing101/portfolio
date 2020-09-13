const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

// Add new article
router.get("/new", (req, res) => {
  res.render("articles/new");
});



module.exports = router;
