const mongoose = require('mongoose');

const VerificationLogSchema = new mongoose.Schema({
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  ip: { type: String },
  userAgent: { type: String },
  verifiedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'] }
});

module.exports = mongoose.model('VerificationLog', VerificationLogSchema);