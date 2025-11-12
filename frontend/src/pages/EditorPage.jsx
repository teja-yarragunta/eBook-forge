import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Sparkles,
  FileDown,
  Save,
  Menu,
  X,
  Edit,
  NotebookText,
  ChevronDown,
  FileText,
} from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import DropDown, { DropDownItem } from "../components/ui/DropDown";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import SelectField from "../components/ui/SelectField";
import ChapterSidebar from "../components/editor/ChapterSidebar";
import ChapterEditorTab from "../components/editor/ChapterEditorTab";
import BookDetailsTab from "../components/editor/BookDetailsTab";

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("editor");
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // AI Modal State
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  // Note: isGenerating will be either false or a numeric index
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );
        setBook(response.data);
      } catch (error) {
        toast.error("Failed to load book details.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId, navigate]);

  // Handlers (kept as you provided)
  const handleBookChange = (eOrName, maybeValue) => {
    let name, value;
    if (eOrName && eOrName.target) {
      ({ name, value } = eOrName.target);
    } else if (typeof eOrName === "string") {
      name = eOrName;
      value = maybeValue;
    } else if (eOrName && eOrName.name) {
      ({ name, value } = eOrName);
    } else return;

    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleChapterChange = (eOrName, maybeValue) => {
    if (!book) return;
    let name, value;

    if (eOrName && eOrName.target) {
      ({ name, value } = eOrName.target);
    } else if (typeof eOrName === "string") {
      name = eOrName;
      value = maybeValue;
    } else if (eOrName && eOrName.name) {
      ({ name, value } = eOrName);
    } else return;

    const updatedChapters = [...(book.chapters || [])];
    updatedChapters[selectedChapterIndex] = {
      ...updatedChapters[selectedChapterIndex],
      [name]: value,
    };
    setBook((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleAddChapter = () => {
    const newChapter = {
      title: `Chapter ${book.chapters.length + 1}`,
      content: "",
    };
    const updatedChapters = [...book.chapters, newChapter];
    setBook((prev) => ({ ...prev, chapters: updatedChapters }));
    setSelectedChapterIndex(updatedChapters.length - 1);
  };

  const handleDeleteChapter = (index) => {
    if (book.chapters.length <= 1) {
      toast.error("A book must have at least one chapter.");
      return;
    }

    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    setBook((prev) => ({ ...prev, chapters: updatedChapters }));

    setSelectedChapterIndex((prevIndex) =>
      prevIndex >= index ? Math.max(0, prevIndex - 1) : prevIndex
    );
  };

  const handleReorderChapters = (oldIndex, newIndex) => {
    setBook((prev) => ({
      ...prev,
      chapters: arrayMove(prev.chapters, oldIndex, newIndex),
    }));
    setSelectedChapterIndex(newIndex); // Keep selected chapter consistent after reorder
  };

  const handleSaveChanges = async (bookToSave = book, showToast = true) => {
    setIsSaving(true);
    try {
      await axiosInstance.patch(
        `${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`,
        bookToSave
      );
      if (showToast) {
        toast.success("Changes saved successfully!");
      }
    } catch (error) {
      console.log("ERRrR", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    setIsUploading(true);
    try {
      const response = await axiosInstance.put(
        `${API_PATHS.BOOKS.UPDATE_COVER}/${bookId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // 👇 Safely handle both possible response shapes
      const updatedBook = response.data.book || response.data;
      setBook(updatedBook);

      // 👇 Switch to BookDetails tab to show the new image
      setActiveTab("details");
      toast.success("Cover image updated!");
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      toast.error("Failed to upload cover image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateChapterContent = async (index) => {
    const chapter = book.chapters[index];
    if (!chapter || !chapter.title) {
      toast.error("Chapter title is required to generate content.");
      return;
    }

    // Set numeric index so sidebar item can detect which is generating
    setIsGenerating(index);
    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_CHAPTER_CONTENT,
        {
          chapterTitle: chapter.title,
          chapterDescription: chapter.description || "",
          style: aiStyle,
        }
      );

      const updatedChapters = [...book.chapters];
      updatedChapters[index].content = response.data.content;
      const updatedBook = { ...book, chapters: updatedChapters };

      setBook(updatedBook);
      toast.success(`Content for "${chapter.title}" generated!`);
      await handleSaveChanges(updatedBook, false);
    } catch (error) {
      toast.error("Failed to generate chapter content.");
    } finally {
      // reset generating
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    toast.loading("Generating PDF ...");
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPORT.PDF}/${bookId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("PDF export started!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportDoc = async () => {
    toast.loading("Generating Document...");
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPORT.DOC}/${bookId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.title}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Document export started!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to export document.");
    }
  };

  if (isLoading || !book) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-gray-600 text-sm font-medium">Loading Editor...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full w-80 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
        <ChapterSidebar
          book={book}
          selectedChapterIndex={selectedChapterIndex}
          onSelectChapter={(index) => setSelectedChapterIndex(index)}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          onGenerateChapterContent={handleGenerateChapterContent}
          isGenerating={isGenerating}
          onReorderChapters={handleReorderChapters}
        />
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="relative flex flex-col w-72 sm:w-80 bg-white shadow-2xl rounded-r-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-3 right-3 flex items-center justify-center h-9 w-9 rounded-full bg-white shadow hover:bg-violet-100 text-gray-600 hover:text-violet-600 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              <ChapterSidebar
                book={book}
                selectedChapterIndex={selectedChapterIndex}
                onSelectChapter={(index) => {
                  setSelectedChapterIndex(index);
                  setIsSidebarOpen(false);
                }}
                onAddChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                onGenerateChapterContent={handleGenerateChapterContent}
                isGenerating={isGenerating}
                onReorderChapters={handleReorderChapters}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50">
        {/* Header Toolbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm shrink-0">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-md bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center bg-slate-100 rounded-lg p-1 shadow-inner">
                <button
                  onClick={() => setActiveTab("editor")}
                  className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "editor"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  Editor
                </button>

                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "details"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <NotebookText className="w-4 h-4" />
                  BookDetails
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropDown
                trigger={
                  <Button
                    variant="secondary"
                    icon={FileDown}
                    className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-3 py-2 shadow-sm transition-all"
                  >
                    Export
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                }
              >
                <DropDownItem onClick={handleExportPDF}>
                  <FileText className="w-4 h-4 mr-2 text-slate-600" />
                  Export as PDF
                </DropDownItem>
                <DropDownItem onClick={handleExportDoc}>
                  <FileText className="w-4 h-4 mr-2 text-slate-600" />
                  Export as Document
                </DropDownItem>
              </DropDown>

              <Button
                onClick={() => handleSaveChanges()}
                isLoading={isSaving}
                icon={Save}
                className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg px-4 py-2 transition-all duration-200"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "editor" ? (
            <ChapterEditorTab
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onChapterChange={handleChapterChange}
              onGenerateChapterContent={handleGenerateChapterContent}
              isGenerating={isGenerating}
            />
          ) : (
            <BookDetailsTab
              book={book}
              onBookChange={handleBookChange}
              onCoverUpload={handleCoverImageUpload}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
