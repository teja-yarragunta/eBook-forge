const express = require("express");
const {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { authUser } = require("../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.post("/signup", signupUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", authUser, getUserProfile);
authRouter.patch("/profile", authUser, updateUserProfile);

module.exports = authRouter;
