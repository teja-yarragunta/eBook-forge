const express = require("express");
const {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  updateBookCoverImage,
  deleteBookById,
} = require("../controllers/bookController");
const { authUser } = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const bookRouter = express.Router();

// apply authUser middleware to all routes
bookRouter.use(authUser);

bookRouter.route("/").post(createBook).get(getBooks);
bookRouter
  .route("/:id")
  .get(getBookById)
  .patch(updateBookById)
  .delete(deleteBookById);
bookRouter.route("/cover/:id").put(uploadMiddleware, updateBookCoverImage);

module.exports = bookRouter;
