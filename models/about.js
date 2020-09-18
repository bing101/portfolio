const mongoose = require("mongoose");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const aboutSchema = new mongoose.Schema({
  markdown: {
    type: String,
    required: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});

aboutSchema.pre("validate", function (next) {
  // Convert raw md to html
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }

  next();
});

module.exports = mongoose.model("About", aboutSchema);
