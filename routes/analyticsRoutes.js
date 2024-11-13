const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  bloodGroupDetailsController,
} = require("../controller/analyticsController");

const router = express.Router();

// Get all  Blood analytics records
router.get(
  "/bloodGroups-data",
  authMiddleware,
  bloodGroupDetailsController
);
module.exports = router;
