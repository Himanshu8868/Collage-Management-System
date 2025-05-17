const express = require("express");
const router = express.Router();
const {
  createWeeklySchedule,
  getWeeklySchedule
} = require("../controllers/WeeklyControllers");
const { protect, isAdmin , isStudent } = require('../middleware/authMiddleware');



router.post("/create", protect , createWeeklySchedule);
router.get("/",protect ,getWeeklySchedule); // ?course=...&semester=...

module.exports = router;
