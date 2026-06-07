const express = require("express");
const router = express.Router();

const {createAppointment, getAllAppointments} = require("../controllers/control");
const { authMiddleware } = require("../middleware/auth");

// Public endpoint for patients to book appointments (no auth required)
router.post("/appointment", createAppointment);
// Admin-only endpoint to view all appointments
router.get("/appointment", authMiddleware, getAllAppointments);

module.exports = router;