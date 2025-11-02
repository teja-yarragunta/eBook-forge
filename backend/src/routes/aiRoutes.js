const express = require("express");
const {
  generateOutline,
  generateChapterContent,
} = require("../controllers/aiController");
const { authUser } = require("../middlewares/authMiddleware");

const aiRouter = express.Router();

aiRouter.use(authUser);

aiRouter.post("/generate-outline", generateOutline);
aiRouter.post("/generate-chapter-content", generateChapterContent);

module.exports = aiRouter;
