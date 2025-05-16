const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
