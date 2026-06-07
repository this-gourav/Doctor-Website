const express = require("express");

const router = express.Router();

const {
  signup,
  login,
} = require("../controllers/authcontroller");

const { authMiddleware, isAdmin } = require("../middleware/auth");
const { getAllAppointments } = require("../controllers/control");

router.post("/signup", signup);
router.post("/login", login);
router.get("/admin/appointments", authMiddleware, isAdmin, getAllAppointments);

module.exports = router;