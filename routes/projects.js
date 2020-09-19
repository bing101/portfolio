const express = require("express");
const router = express.Router();
const Projects = require("../models/projects");

// get all articles
router.get("/", async (req, res) => {
  let projects = await Projects.find().sort({ date: "desc" });
  res.render("projects/projects", { projects: projects });
});

// Get form for adding new project
router.get("/new", (req, res) => {
  project = new Projects();
  res.render("projects/new", { project: project });
});

// edit article
router.get("/edit/:id", async (req, res) => {
  const project = await Projects.findById(req.params.id);
  res.render("projects/edit", { project: project });
});

// A helper function for post and put req
const saveProjectAndRedirect = (path) => async (req, res) => {
  let project = req.project;

  project.title = req.body.title;
  project.link = req.body.link;
  project.description = req.body.description;
  project.content = req.body.content;

  console.log("project tile");
  console.log(project.title);
  try {
    project = await project.save();

    res.redirect("/projects");
  } catch (e) {
    console.log("Error !!");
    console.log(e);
    res.render(`projects/${path}`, { project: project });
  }
};

// Add New project
router.post(
  "/",
  async (req, res, next) => {
    req.project = new Projects();
    next();
  },
  saveProjectAndRedirect("new")
);

// Edit project
router.put(
  "/:id",
  async (req, res, next) => {
    req.project = await Projects.findById(req.params.id);
    next();
  },
  saveProjectAndRedirect("edit")
);

// Delete a project
// deleting an article
router.delete("/:id", async (req, res) => {
  await Projects.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
