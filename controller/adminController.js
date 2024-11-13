const usermodels = require("../models/usermodels");

// GET DONOR LIST
const getDonarsListController = async (req, res) => {
  try {
    const donarData = await usermodels
      .find({ role: "donar" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      TotalCount: donarData.length,
      message: "Donor List Fetched Successfully",
      donarData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donor List API",
      error,
    });
  }
};

// GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await usermodels
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      TotalCount: hospitalData.length,
      message: "Hospital List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Hospital List API",
      error,
    });
  }
};

// GET ORGANIZATION LIST
const getOrgListController = async (req, res) => {
  try {
    const orgData = await usermodels
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      TotalCount: orgData.length,
      message: "Organization List Fetched Successfully",
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Organization List API",
      error,
    });
  }
};

// DELETE DONOR
const deleteDonarController = async (req, res) => {
  try {
    await usermodels.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting",
      error,
    });
  }
};

// EXPORT
module.exports = {
  getDonarsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonarController,
};