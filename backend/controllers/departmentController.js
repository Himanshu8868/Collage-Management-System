const Department = require('../models/Department');

// POST /api/departments
const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Department name is required' });
    }

    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(409).json({ error: 'Department already exists' });
    }

    const newDepartment = new Department({ name });
    await newDepartment.save();

    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
};

// List departments //
const listDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }); // optional sorting
    res.status(200).json(departments);
  } catch (error) {
    console.error("Failed to list departments:", error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

module.exports = {
  createDepartment,
  listDepartments 
};
