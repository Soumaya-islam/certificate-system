const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  backgroundImage: { type: String },
  signatureCEO: { type: String },
  signatureDirector: { type: String },
  logo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Template', TemplateSchema);