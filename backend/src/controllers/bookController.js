const bookModel = require("../models/Book");

// @desc - create a new book
// @route - POST /api/books
// @access - private
exports.createBook = async (req, res) => {
  try {
    const { title, author, subtitle, chapters } = req.body;
    if (!title || !author) {
      return res
        .status(400)
        .json({ message: "please provide both title and author" });
    }
    const book = await bookModel.create({
      userId: req.user._id,
      title,
      author,
      subtitle,
      chapters,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc - get all books from user
// @route - GET /api/books
// @access - private
exports.getBooks = async (req, res) => {
  try {
    const books = await bookModel.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc - get single book by id
// @route - GET /api/books/:id
// @access - private
exports.getBookById = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "not authorized to view this book" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc - update a book
// @route - PATCH /api/books/:id
// @access - private
exports.updateBookById = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "not authorized to update this book" });
    }
    const updatedBook = await bookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc - update a book's cover image
// @route - PUT /api/books/cover/:id
// @access - private
exports.updateBookCoverImage = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "not authorized to update this book cover page" });
    }
    if (req.file) {
      book.coverImage = `/${req.file.path}`;
    } else {
      return res.status(400).json({ message: "no image file uploaded" });
    }
    const updatedBookCoverImage = await book.save();
    res.status(200).json(updatedBookCoverImage);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc - delete a book by id
// @route - DELETE /api/books/:id
// @access - private
exports.deleteBookById = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "not authorized to delete this book" });
    }
    const deleteBook = await book.deleteOne();
    res.status(200).json(deleteBook);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
