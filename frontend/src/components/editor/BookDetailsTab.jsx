import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { UploadCloud } from "lucide-react";
import { BASE_URL } from "../../utils/apiPaths";

const BookDetailsTab = ({
  book,
  onBookChange,
  onCoverUpload,
  isUploading,
  fileInputRef,
}) => {
  const coverImageUrl = book?.coverImage?.startsWith("http")
    ? book.coverImage
    : `${BASE_URL}${book.coverImage || ""}`.replace(/\\/g, "/");

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      {/* Book Details Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          📘 Book Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Title"
            name="title"
            value={book?.title || ""}
            onChange={onBookChange}
            placeholder="Enter book title..."
          />

          <InputField
            label="Author"
            name="author"
            value={book?.author || ""}
            onChange={onBookChange}
            placeholder="Enter author name..."
          />

          <div className="md:col-span-2">
            <InputField
              label="Subtitle"
              name="subtitle"
              value={book?.subtitle || ""}
              onChange={onBookChange}
              placeholder="Enter subtitle (optional)..."
            />
          </div>
        </div>
      </div>

      {/* Cover Image Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          🖼️ Cover Image
        </h3>

        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Book Cover Preview */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <img
              src={coverImageUrl || "https://placehold.co/600x800"}
              alt="Book Cover"
              className="w-48 h-64 object-cover rounded-lg border border-slate-200 shadow-md bg-slate-50"
            />
          </div>

          {/* Upload Controls */}
          <div className="flex flex-col gap-4 w-full md:flex-1">
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload a new cover image for your book. <br />
              <span className="text-slate-500 text-xs">
                Recommended size: 600x800px. Accepted formats: JPG, PNG.
              </span>
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={onCoverUpload}
              accept="image/*"
              className="hidden"
            />

            <Button
              variant="secondary"
              onClick={() => fileInputRef.current.click()}
              isLoading={isUploading}
              icon={UploadCloud}
              className="w-fit bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm rounded-lg px-4 py-2 transition-all duration-200"
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsTab;
