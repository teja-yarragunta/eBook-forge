import { BookOpen, ChevronLeft } from "lucide-react";

const ViewChapterSidebar = ({
  book,
  selectedChapterIndex,
  onSelectChapter,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed lg:relative left-0 top-0 h-full w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-violet-600" />
              </div>
              <span className="font-semibold text-gray-800 text-base">
                Chapters
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Chapters */}
        <div className="overflow-y-auto h-full pb-20">
          {book.chapters.map((chapter, index) => {
            const isSelected = selectedChapterIndex === index;
            return (
              <button
                key={index}
                onClick={() => {
                  onSelectChapter(index);
                  onClose();
                }}
                className={`w-full text-left px-5 py-3 transition-all duration-200 border-b border-gray-100 group ${
                  isSelected
                    ? "bg-violet-50 border-l-4 border-l-violet-600 shadow-inner"
                    : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`font-medium text-sm truncate ${
                    isSelected
                      ? "text-violet-800"
                      : "text-gray-800 group-hover:text-violet-700"
                  }`}
                >
                  {chapter.title}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isSelected
                      ? "text-violet-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                >
                  Chapter {index + 1}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ViewChapterSidebar;
