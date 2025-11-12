const mongoose = require("mongoose");

// chapter schema
const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
});

// book schema
const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary image URL
      default: "",
    },
    coverImagePublicId: {
      type: String, // Cloudinary public_id (for deletion/replacement)
      default: "",
    },
    chapters: [chapterSchema],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("book", bookSchema);
