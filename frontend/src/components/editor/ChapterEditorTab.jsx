import { useMemo, useState } from "react";
import { Sparkles, Type, Eye } from "lucide-react";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import SimpleMDEditor from "./SimpleMDEditor";
import MDEditor from "@uiw/react-md-editor";

const ChapterEditorTab = ({
  book = {
    title: "Untitled",
    chapters: [{ title: "Chapter 1", content: "-" }],
  },
  selectedChapterIndex = 0,
  onChapterChange = () => {},
  onGenerateChapterContent = () => {},
  isGenerating,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const mdeOptions = useMemo(() => {
    return {
      spellChecker: true,
      minHeight: "300px",
      maxHeight: "800px",
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
    };
  }, []);

  if (
    !book ||
    selectedChapterIndex == null ||
    !book.chapters?.[selectedChapterIndex]
  ) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Type className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">
            Select a chapter to start editing
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Choose from the sidebar to begin writing.
          </p>
        </div>
      </div>
    );
  }

  const currentChapter = book.chapters[selectedChapterIndex] || {
    title: "",
    content: "",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chapter Editor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Editing:{" "}
            {currentChapter.title || `Chapter ${selectedChapterIndex + 1}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setIsPreviewMode(false)}
              className={`px-3 py-2 text-sm font-medium ${
                !isPreviewMode
                  ? "bg-violet-50 text-violet-700 border-r border-violet-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setIsPreviewMode(true)}
              className={`px-3 py-2 text-sm font-medium ${
                isPreviewMode
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Preview
            </button>
          </div>

          <Button
            onClick={() => onGenerateChapterContent(selectedChapterIndex)}
            isLoading={isGenerating === selectedChapterIndex}
            icon={Sparkles}
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-sm"
          >
            Generate with AI
          </Button>
        </div>
      </div>

      {/* Chapter Title */}
      <div>
        <InputField
          label="Chapter Title"
          name="title"
          value={currentChapter.title || ""}
          onChange={onChapterChange}
          placeholder="Enter chapter title..."
          className="text-lg"
        />
      </div>

      {/* EDIT MODE */}
      {!isPreviewMode && (
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 text-sm text-gray-700 font-medium">
            Markdown Editor
          </div>
          <div className="p-4 bg-white">
            <SimpleMDEditor
              value={currentChapter.content || ""}
              onChange={(value) => onChapterChange({ name: "content", value })}
              options={mdeOptions}
            />
          </div>
        </div>
      )}

      {/* PREVIEW MODE — Full width identical to editor preview */}
      {isPreviewMode && (
        <div className="border border-gray-200 rounded-lg bg-white p-6">
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            <span>Preview Mode</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentChapter.title}
          </h2>

          <div className="max-w-none wrap-break-words">
            <MDEditor.Markdown
              source={currentChapter.content || ""}
              className="wmde-markdown max-w-none wrap-break-words"
              style={{
                backgroundColor: "white",
                color: "#111827",
                fontFamily: 'Charter, Georgia, "Times New Roman", serif',
                lineHeight: 1.75,
              }}
            />
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3">
        <div className="flex items-center gap-6">
          <span>
            Words:{" "}
            {currentChapter.content
              ? currentChapter.content.split(/\s+/).filter(Boolean).length
              : 0}
          </span>
          <span>
            Characters:{" "}
            {currentChapter.content ? currentChapter.content.length : 0}
          </span>
        </div>
        <div className="text-xs text-gray-400">Auto-saved</div>
      </div>
    </div>
  );
};

export default ChapterEditorTab;
