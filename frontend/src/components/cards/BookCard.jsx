import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, X, AlertTriangle } from "lucide-react";

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Directly use the Cloudinary URL (no BASE_URL prefix needed)
  const coverImageUrl = book.coverImage?.startsWith("http")
    ? book.coverImage
    : "";

  return (
    <>
      {/* Book Card */}
      <div
        onClick={() => navigate(`/view-book/${book._id}`)}
        className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-violet-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        {/* Cover Image */}
        <div className="relative overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={book.title}
              className="w-full aspect-3/4 object-contain transition-transform duration-500 group-hover:scale-105 bg-white"
              onError={(e) => {
                e.target.src = "/placeholder-book.png";
              }}
            />
          ) : (
            <div className="aspect-3/4 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
              No Cover
            </div>
          )}

          {/* Hover Action Buttons */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/editor/${book._id}`);
              }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition"
            >
              <Edit className="w-4 h-4 text-gray-700" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition group/delete"
            >
              <Trash2 className="w-4 h-4 text-red-500 group-hover/delete:text-red-600" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {book.title || "Untitled eBook"}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1">
            {book.author || "Unknown Author"}
          </p>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center relative border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete eBook?
              </h2>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900">
                  “{book.title}”
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center space-x-3 pt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(book._id);
                    setShowConfirm(false);
                  }}
                  className="px-4 py-2 text-sm rounded-lg bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;
