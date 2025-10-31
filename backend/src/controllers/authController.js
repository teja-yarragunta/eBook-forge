const jwt = require("jsonwebtoken");

const userModel = require("../models/User");
const { validateSignup } = require("../utils/validateSignup");

// generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

// @desc - register new user
// @route - POST /api/auth/signup
// @access - public
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all the details" });
    }
    // validate user input
    try {
      validateSignup(req);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }
    // check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // create new user
    const newUser = await userModel.create({ name, email, password });
    res.status(201).json({
      message: "Signup successful",
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc - login user
// @route - POST /api/auth/login
// @access - public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// @desc - get user profile
// @route - GET /api/auth/profile
// @access - private
exports.getUserProfile = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// @desc - update user profile
// @route - POST /api/auth/
// @access - private
exports.updateUserProfile = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
