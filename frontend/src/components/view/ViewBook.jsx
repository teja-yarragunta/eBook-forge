import { useState } from "react";
import { Menu, ChevronLeft } from "lucide-react";
import ViewChapterSidebar from "./ViewChapterSidebar";

const ViewBook = ({ book }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  const selectedChapter = book.chapters[selectedChapterIndex];

  // Markdown + image formatting
  const formatContent = (content) => {
    if (!content) return "";

    return content
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, "<em>$1</em>")
      .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .split("\n\n")
      .map((p) => `<p>${p}</p>`)
      .join("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className="h-full overflow-y-auto">
        <ViewChapterSidebar
          book={book}
          selectedChapterIndex={selectedChapterIndex}
          onSelectChapter={setSelectedChapterIndex}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-white">
        {/* Header */}
        <header className="flex items-center justify-between h-16 border-b border-gray-100 px-6 shrink-0 bg-white z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="font-semibold text-base md:text-lg truncate">
                {book.title}
              </h1>
              <p className="text-sm text-gray-500">by {book.author}</p>
            </div>
          </div>

          {/* Font Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-1 hover:bg-gray-100 rounded-md text-sm font-semibold"
            >
              A-
            </button>
            <span className="text-sm text-gray-600">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="px-2 py-1 hover:bg-gray-100 rounded-md text-sm font-semibold"
            >
              A+
            </button>
          </div>
        </header>

        {/* Reading Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 leading-tight text-gray-900">
              {selectedChapter.title}
            </h1>

            <div
              className="reading-content text-gray-800"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: 1.8,
                fontFamily: 'Charter, Georgia, "Times New Roman", serif',
              }}
              dangerouslySetInnerHTML={{
                __html: formatContent(selectedChapter.content),
              }}
            />

            {/* Navigation */}
            <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200">
              <button
                onClick={() =>
                  setSelectedChapterIndex(Math.max(0, selectedChapterIndex - 1))
                }
                disabled={selectedChapterIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedChapterIndex === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-gray-500">
                {selectedChapterIndex + 1} of {book.chapters.length}
              </span>

              <button
                onClick={() =>
                  setSelectedChapterIndex(
                    Math.min(book.chapters.length - 1, selectedChapterIndex + 1)
                  )
                }
                disabled={selectedChapterIndex === book.chapters.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedChapterIndex === book.chapters.length - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Next
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .reading-content h1,
        .reading-content h2,
        .reading-content h3 {
          font-weight: 700;
          color: #1f2937;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .reading-content h1 {
          font-size: 1.75em;
        }
        .reading-content h2 {
          font-size: 1.5em;
        }
        .reading-content h3 {
          font-size: 1.25em;
        }
        .reading-content p {
          margin-bottom: 1.5em;
          text-align: justify;
          hyphens: auto;
        }
        .reading-content blockquote {
          border-left: 4px solid #7c3aed;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
          margin: 1.5rem 0;
          background: #f9fafb;
        }
        .reading-content strong {
          font-weight: 600;
          color: #111827;
        }
        .reading-content em {
          font-style: italic;
          color: #374151;
        }
        .reading-content a {
          color: #4f46e5;
          text-decoration: underline;
        }
        .reading-content img {
          max-width: 100%;
          margin: 2rem auto;
          display: block;
          border-radius: 0.75rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
        }
        .reading-content code {
          background: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default ViewBook;
