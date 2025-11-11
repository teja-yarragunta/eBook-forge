import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Book } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import ViewBook from "../components/view/ViewBook";

const ViewBookSkeleton = () => (
  <div className="animate-pulse px-6 py-12">
    <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-1/4 mb-8"></div>
    <div className="flex gap-8">
      <div className="w-1/4">
        <div className="h-96 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="w-3/4">
        <div className="h-full bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const ViewBookPage = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );
        setBook(response.data);
      } catch (error) {
        toast.error("Failed to fetch eBook.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  return (
    <DashboardLayout>
      {isLoading ? (
        <ViewBookSkeleton />
      ) : book ? (
        <ViewBook book={book} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-slate-200 rounded-xl bg-white shadow-sm mx-auto max-w-lg mt-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Book className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            eBook Not Found
          </h3>
          <p className="text-slate-500 mb-6 max-w-md px-6">
            The eBook you are looking for does not exist or you do not have
            permission to view it.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ViewBookPage;
