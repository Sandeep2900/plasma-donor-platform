const usermodels = require("../models/usermodels");
const inventorymodels = require("../models/invetorymodels");
const mongoose = require("mongoose");
const invetorymodels = require("../models/invetorymodels");

// Create Inventory Controller
const createInventoryController = async (req, res) => {
  try {
    const { email, inventoryType, bloodGroup, quantity } = req.body;

    // Log the incoming request body
    console.log("Request Body:", req.body);
    //Parse quantity to a number
    const requestedQuantity = parseFloat(quantity);

    // Validate user existence
    const user = await usermodels.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Log the user details for debugging
    console.log("User details:", user);

    // Handle the "out" inventoryType (blood is being taken out)
    if (inventoryType === "out") {
      if (user.role !== "hospital") {
        return res.status(400).send({
          success: false,
          message: "Only hospitals can perform 'out' operations.",
        });
      }

      const requestedBloodGroup = bloodGroup;
      const requestedQuantity = quantity;
      const organization = new mongoose.Types.ObjectId(req.body.organization);

      // Calculate total 'in' blood quantity for the requested blood group
      const totalInOfRequestedBlood = await inventorymodels.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      // Log total in
      console.log("Total In:", totalIn);

      // Calculate total 'out' blood quantity for the requested blood group
      const totalOutOfRequestedBloodGroup = await inventorymodels.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      // Log total out
      console.log("Total Out:", totalOut);

      // Calculate the available quantity
      const availableQuantity = totalIn - totalOut;

      // Log available quantity
      console.log("Available Quantity:", availableQuantity);

      // Validate requested quantity against available quantity
      if (availableQuantity < requestedQuantity) {
        return res.status(400).send({
          success: false,
          message: `Insufficient blood available. Only ${availableQuantity} mL of ${requestedBloodGroup.toUpperCase()} is available.`,
        });
      }

      // Set the hospital field
      req.body.hospital = user._id;
    } else if (inventoryType === "in") {
      // Validate that only donors can add blood
      if (user.role !== "donar") {
        return res.status(400).send({
          success: false,
          message: "Only donors can perform 'in' operations.",
        });
      }
      // Set the donor field
      req.body.donar = user._id;
    } else {
      // If the inventory type is neither 'in' nor 'out', return an error
      return res.status(400).send({
        success: false,
        message: "Invalid inventory type. Must be 'in' or 'out'.",
      });
    }

    // Save the inventory record
    const inventory = new inventorymodels(req.body);
    await inventory.save();

    // Return success response
    return res.status(201).send({
      success: true,
      message: "New blood record added successfully",
      inventory,
    });
  } catch (error) {
    console.error(error); // Log error for debugging

    // Return error response
    return res.status(500).send({
      success: false,
      message: "Error in create inventory API",
      error: error.message, // Return the error message
    });
  }
};

// Get Inventory Controller
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventorymodels
      .find({ organization: req.body.userId })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Inventory records fetched successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in fetching inventory records",
      error: error.message, // Return the error message
    });
  }
};

// Get Inventory Controller
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventorymodels
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organization")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: " consumers Inventory records fetched successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in consumers inventory records",
      error: error.message, // Return the error message
    });
  }
};
//get donar record
const getDonarsController = async (req, res) => {
  try {
    const organization = req.body.userId;
    //find donars
    const donarId = await inventorymodels.distinct("donar", { organization });
    // console.log(donarId);
    const donars = await usermodels.find({ _id: { $in: donarId } });
    return res.status(200).send({
      success: true,
      message: "Donar Record fetched successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donar records",
      error,
    });
  }
};
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await invetorymodels
      .find({
        organization: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Inventory Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organization = req.body.userId;
    //get hospitals id
    const hospitalId = await inventorymodels.distinct("hospital", {
      organization,
    });

    //find hospital
    const hospitals = await usermodels.find({
      _id: { $in: hospitalId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital data fetched successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get Hospital Api",
      error,
    });
  }
};
//get ORG
const getOrganizationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventorymodels.distinct("organization", { donar });
    //find org
    const organizations = await usermodels.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Organization data fetched successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting organzation record",
      error,
    });
  }
};
//get ORG
const getOrganizationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventorymodels.distinct("organization", { hospital });
    //find org
    const organizations = await usermodels.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: " HospitalOrganization data fetched successfully",

      organizations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting Hospitalorganzation record",

      error,
    });
  }
};
module.exports = {
  createInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalController,
  getOrganizationController,
  getOrganizationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
};
