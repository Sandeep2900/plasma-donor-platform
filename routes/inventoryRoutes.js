const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalController,
  getOrganizationController,
  getOrganizationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
} = require("../controller/inventoryController");

const router = express.Router();

//routes
//Add inventory \\post
router.post("/create-inventory", authMiddleware, createInventoryController);
// Get all blood records
router.get("/get-inventory", authMiddleware, getInventoryController);
// Get Hospital blood records
router.post("/get-inventory-hospital", authMiddleware, getInventoryHospitalController);
// Get all donar records
router.get("/get-donars", authMiddleware, getDonarsController);
// Get all Hospital records
router.get("/get-hospitals", authMiddleware, getHospitalController);
// Get all Organization records
router.get("/get-organization", authMiddleware, getOrganizationController);
// Get all Organization records
router.get("/get-organization-for-hospital", authMiddleware, 
    getOrganizationForHospitalController);
    // Get all Organization records
router.get("/get-recent-inventory", authMiddleware, 
  getRecentInventoryController);
  

module.exports = router;
