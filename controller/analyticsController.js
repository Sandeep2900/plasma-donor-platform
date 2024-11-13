const invetorymodels = require("../models/invetorymodels");
const mongoose = require("mongoose");

const bloodGroupDetailsController = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
    const bloodGroupdata = [];
    const organization = new mongoose.Types.ObjectId(req.body.userId);

    await Promise.all(bloodGroups.map(async (bloodGroup) => {
      // count total in
      const totalIn = await invetorymodels.aggregate([
        {
          $match: {
            bloodGroup: bloodGroup,
            inventoryType: "in",
            organization,
          },
        },
        {
          $addFields: {
            quantityAsNumber: {
              $cond: {
                if: { $regexMatch: { input: "$quantity", regex: /^[0-9]+$/ } },
                then: { $toDouble: "$quantity" },
                else: 0
              }
            }
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quantityAsNumber" },
          },
        },
      ]);

      console.log(`Total In for ${bloodGroup}:`, totalIn);

      // count total out
      const totalOut = await invetorymodels.aggregate([
        {
          $match: {
            bloodGroup: bloodGroup,
            inventoryType: "out",
            organization,
          },
        },
        {
          $addFields: {
            quantityAsNumber: {
              $cond: {
                if: { $regexMatch: { input: "$quantity", regex: /^[0-9]+$/ } },
                then: { $toDouble: "$quantity" },
                else: 0
              }
            }
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quantityAsNumber" },
          },
        },
      ]);

      console.log(`Total Out for ${bloodGroup}:`, totalOut);

      // calculate available blood
      const availableBlood = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);
      console.log(`Available Blood for ${bloodGroup}:`, availableBlood);

      // push data
      bloodGroupdata.push({
        bloodGroup,
        totalIn: totalIn[0]?.total || 0,
        totalOut: totalOut[0]?.total || 0,
        availableBlood,
      });
    }));

    return res.status(200).send({
      success: true,
      message: "Blood Group Data fetched successfully",
      bloodGroupdata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Bloodgroup data analytics API",
      error,
    });
  }
};

module.exports = { bloodGroupDetailsController };