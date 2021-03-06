const express = require("express");
const router = express.Router();
const Projects = require("../models/projects");
const { ensureAuthenticated } = require("../config/auth");

// get all articles
router.get("/", async (req, res) => {
  let projects = await Projects.find().sort({ date: "desc" });
  res.render("projects/projects", { projects: projects });
});

// Get form for adding new project
router.get("/new", ensureAuthenticated, (req, res) => {
  project = new Projects();
  res.render("projects/new", { project: project });
});

// edit article
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
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

  try {
    project = await project.save();

    res.redirect("/users/admin/projects");
  } catch (e) {
    console.log(e);
    res.render(`projects/${path}`, { project: project });
  }
};

// Add New project
router.post(
  "/",
  ensureAuthenticated,
  async (req, res, next) => {
    req.project = new Projects();
    next();
  },
  saveProjectAndRedirect("new")
);

// Edit project
router.put(
  "/:id",
  ensureAuthenticated,
  async (req, res, next) => {
    req.project = await Projects.findById(req.params.id);
    next();
  },
  saveProjectAndRedirect("edit")
);

// Delete a project
// deleting an article
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  await Projects.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
