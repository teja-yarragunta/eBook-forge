import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Sparkles,
  Trash2,
  ArrowLeft,
  BookOpen,
  Hash,
  Lightbulb,
  Palette,
} from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [bookTitle, setBookTitle] = useState("");
  const [numChapters, setNumChapters] = useState(5);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  const [chapters, setChapters] = useState([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isFinalizingBook, setIsFinalizingBook] = useState(false);
  const chaptersContainerRef = useRef(null);

  const resetModal = () => {
    setStep(1);
    setBookTitle("");
    setNumChapters(5);
    setAiTopic("");
    setAiStyle("Informative");
    setChapters([]);
    setIsGeneratingOutline(false);
    setIsFinalizingBook(false);
  };

  const handleGenerateOutline = async () => {
    if (!bookTitle || !numChapters) {
      toast.error("Please provide a book title and number of chapters.");
      return;
    }
    setIsGeneratingOutline(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
        topic: bookTitle,
        description: aiTopic || "",
        style: aiStyle,
        numChapters: numChapters,
      });
      setChapters(response.data.outline);
      setStep(2);
      toast.success("Outline generated! Review and edit chapters.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate outline."
      );
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  const handleDeleteChapter = (index) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      { title: `Chapter ${chapters.length + 1}`, description: "" },
    ]);
  };

  const handleFinalizeBook = async () => {
    if (!bookTitle || chapters.length === 0) {
      toast.error("Book title and at least one chapter are required.");
      return;
    }
    setIsFinalizingBook(true);
    try {
      const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
        title: bookTitle,
        author: user.name || "Unknown Author",
        chapters: chapters,
      });

      toast.success("eBook created successfully!");
      onBookCreated(response.data._id);
      onClose();
      resetModal();
    } catch (error) {
      console.log("TEST_", bookTitle, chapters);
      toast.error(error.response?.data?.message || "Failed to create eBook.");
    } finally {
      setIsFinalizingBook(false);
    }
  };

  useEffect(() => {
    if (step === 2 && chaptersContainerRef.current) {
      const scrollableDiv = chaptersContainerRef.current;
      scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chapters.length, step]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose(), resetModal();
      }}
      title="Create New eBook"
    >
      {step === 1 && (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500 text-white text-sm font-semibold shadow">
              1
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
              2
            </div>
          </div>

          {/* Book Title */}
          <InputField
            icon={BookOpen}
            label="Book Title"
            placeholder="Enter your book title..."
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />

          {/* Number of Chapters */}
          <InputField
            icon={Hash}
            label="Number of Chapters"
            type="number"
            placeholder="5"
            value={numChapters}
            onChange={(e) => setNumChapters(parseInt(e.target.value) || 1)}
            min="1"
            max="20"
          />

          {/* Topic */}
          <InputField
            icon={Lightbulb}
            label="Topic (Optional)"
            placeholder="Enter a specific topic for AI generation..."
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
          />

          {/* Writing Style */}
          <SelectField
            icon={Palette}
            label="Writing Style"
            value={aiStyle}
            onChange={(e) => setAiStyle(e.target.value)}
            options={[
              "Informative",
              "Storytelling",
              "Casual",
              "Professional",
              "Humorous",
            ]}
          />

          {/* Generate Outline Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleGenerateOutline}
              isLoading={isGeneratingOutline}
              icon={Sparkles}
              className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Generate Outline with AI
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500 text-white text-sm font-semibold shadow">
              1
            </div>
            <div className="flex-1 h-0.5 bg-violet-500"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-600 text-white text-sm font-semibold shadow">
              2
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Chapters
            </h3>
            <span className="text-sm text-gray-500">
              {chapters.length} chapters
            </span>
          </div>

          {/* Chapters Container */}
          <div
            ref={chaptersContainerRef}
            className="max-h-[350px] overflow-y-auto space-y-4 p-2 rounded-lg border border-gray-100 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
          >
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                <BookOpen className="w-10 h-10 text-violet-400 mb-3" />
                <p className="text-sm">
                  No chapters yet. Add one to get started.
                </p>
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-medium">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) =>
                          handleChapterChange(index, "title", e.target.value)
                        }
                        placeholder="Chapter Title"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                      />
                    </div>

                    <button
                      onClick={() => handleDeleteChapter(index)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all"
                      title="Delete Chapter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    value={chapter.description}
                    onChange={(e) =>
                      handleChapterChange(index, "description", e.target.value)
                    }
                    placeholder="Brief description of what this chapter covers..."
                    rows={2}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all resize-none"
                  />
                </div>
              ))
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              icon={ArrowLeft}
              className="text-gray-700 hover:text-violet-600"
            >
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={handleAddChapter}
                icon={Plus}
                className="text-gray-700 border border-gray-200 bg-gray-50 hover:bg-gray-100"
              >
                Add Chapter
              </Button>
              <Button
                onClick={handleFinalizeBook}
                isLoading={isFinalizingBook}
                className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Create eBook
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateBookModal;
