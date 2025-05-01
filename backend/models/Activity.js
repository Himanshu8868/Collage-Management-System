const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who did the activity
  action: { type: String, required: true }, // e.g. 'Created user', 'Updated course'
  type: { type: String }, // e.g. 'user', 'course', 'attendance' (optional filter)
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);


