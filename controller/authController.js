const usermodels = require("../models/usermodels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerController = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      organization,
      hospitalname,
      website,
      phone,
      role,
      address,
    } = req.body;

    // Log request body to debug
    console.log("Request body:", req.body);

    // Validate required fields
    if (!email || !password || !phone) {
      return res.status(400).send({
        success: false,
        message: "Email, Password, and Phone number are required",
      });
    }

    // Additional role-based validation
    if (role === "organization" && !organization) {
      return res.status(400).send({
        success: false,
        message: "Organization name is required for organizations",
      });
    }
    if (role === "hospital" && !hospitalname) {
      return res.status(400).send({
        success: false,
        message: "Hospital name is required for hospitals",
      });
    }

    // Check if the user already exists
    const existingUser = await usermodels.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User Already Exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user and save
    const user = new usermodels({ ...req.body, password: hashedPassword });
    await user.save();

    return res.status(201).send({
      success: true,
      message: "User Registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registered API",
      error,
    });
  }
};

//login callback
const loginController = async (req, res) => {
  try {
    const existingUser = await usermodels.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    if (existingUser.role != req.body.role) {
      return res.status(500).send({
        success: false,
        message: "Role doesnt match",
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

const currentUserController = async (req, res) => {
  try {
    const existingUser = await usermodels.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user:existingUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to get current user",
      error,
    });
  }
};
module.exports = { registerController, loginController, currentUserController };
