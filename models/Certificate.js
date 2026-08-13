const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  certificateNumber: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  courseName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  status: {
    type: String,
    enum: ['valid', 'revoked', 'pending'],
    default: 'pending'
  },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  pdfUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);