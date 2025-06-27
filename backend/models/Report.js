const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId:         { type: String, required: true },
  analysisResult: { type: mongoose.Schema.Types.Mixed, required: true },
  videoFileName:  { type: String, required: true },
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
