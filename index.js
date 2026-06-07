const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

//mongoose.connect("mongodb://127.0.0.1:27017/appointments");
const dbconnect = require("./config/database");
dbconnect();

app.get("/", (req, res) => {
  res.send("<h1>Doctor Appointment API Running</h1>");
});

const authRoutes =
  require("./routes/authRoutes");

  app.use(
  "/api/auth",
  authRoutes
);

const appointmentRoutes = require("./routes/race");


app.use("/api/v1", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});