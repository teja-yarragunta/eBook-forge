import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Book } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/layout/DashboardLayout";
import CreateBookModal from "../components/modals/CreateBookModal";
import Button from "../components/ui/Button";
import BookCard from "../components/cards/BookCard";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Skeleton Loader for Book Card
const BookCardSkeleton = () => (
  <div className="animate-pulse bg-white border border-slate-200 rounded-lg shadow-sm">
    <div className="w-full aspect-16/25 bg-slate-200 rounded-t-lg"></div>
    <div className="p-4">
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
  </div>
);

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch Books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(response.data);
      } catch (error) {
        toast.error("Failed to fetch your eBooks.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Delete Book
  const handleDeleteBook = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      toast.success("Book deleted successfully");
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const handleBookCreate = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">All eBooks</h1>
            <p className="text-[13px] text-slate-600 mt-1">
              Create, edit, and manage all your AI-generated eBooks.
            </p>
          </div>
          <Button
            className="whitespace-nowrap"
            onClick={handleBookCreate}
            icon={Plus}
          >
            Create New eBook
          </Button>
        </div>

        {/* Conditional Rendering */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-violet-300 rounded-2xl bg-linear-to-br from-white to-violet-50 hover:from-violet-50 hover:to-white transition-all duration-300">
            <div className="w-20 h-20 bg-linear-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-400/30 mb-6">
              <Book className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No eBooks Found
            </h3>
            <p className="text-gray-600 text-sm max-w-sm mb-6">
              You haven't created any eBooks yet. Get started by creating your
              first one.
            </p>
            <Button
              onClick={handleBookCreate}
              icon={Plus}
              className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create Your First eBook
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onBookCreated={(bookId) => {
            setIsCreateModalOpen(false);
            navigate(`/editor/${bookId}`);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
