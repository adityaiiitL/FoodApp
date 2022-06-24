const express = require("express");
const bookingRouter = express.Router();
const { protectRoute } = require("../controller/authController");
const { createSession } = require("../controller/bookingController");

bookingRouter.post("/createSession", protectRoute, createSession);
