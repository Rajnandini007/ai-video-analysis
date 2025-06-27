
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  analysisResult: { type: Object, required: true },
  videoFileName:  { type: String },
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
