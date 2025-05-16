const express = require('express');
const router = express.Router();
const { createDepartment, listDepartments } = require('../controllers/departmentController');

router.post('/', createDepartment);     // Create department
router.get('/', listDepartments);       // Get list of departments

module.exports = router;
