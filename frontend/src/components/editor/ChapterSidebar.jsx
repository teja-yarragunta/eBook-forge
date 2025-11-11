import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Trash2, Plus, GripVertical } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "../ui/Button";

/**
 * SortableItem - shows spinner when isGenerating === index
 */
const SortableItem = ({
  chapter,
  index,
  selectedChapterIndex,
  onSelectChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: chapter._id || `new-${index}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedChapterIndex === index;
  const generatingThis = isGenerating === index;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={() => onSelectChapter(index)}
      role="button"
      tabIndex={0}
      className={`relative group flex items-center rounded-lg border border-slate-200 shadow-sm hover:shadow transition-all duration-200 overflow-hidden cursor-pointer ${
        isSelected
          ? "bg-violet-50 border-violet-300"
          : "bg-white hover:border-violet-200"
      }`}
    >
      <div className="relative flex items-center flex-1 p-3 text-sm overflow-hidden min-w-0">
        <GripVertical
          {...listeners}
          className="w-4 h-4 text-slate-400 mr-2 cursor-grab shrink-0"
        />

        <span
          className={`flex-1 overflow-hidden truncate ${
            isSelected ? "text-violet-800 font-semibold" : "text-slate-700"
          }`}
          title={chapter.title}
        >
          {chapter.title || `Chapter ${index + 1}`}
        </span>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm rounded-lg px-1 py-0.5 shadow-sm">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onGenerateChapterContent(index);
            }}
            className="p-1.5 text-violet-600 hover:text-violet-800 hover:bg-violet-100 rounded-full cursor-pointer"
            title="Generate AI Content"
          >
            {generatingThis ? (
              // spinner
              <span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onDeleteChapter(index);
            }}
            className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full cursor-pointer"
            title="Delete Chapter"
          >
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChapterSidebar = ({
  book,
  selectedChapterIndex,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
  onReorderChapters,
}) => {
  const navigate = useNavigate();
  const chapterIds = (book?.chapters || []).map(
    (chapter, index) => chapter._id || `new-${index}`
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = chapterIds.indexOf(active.id);
      const newIndex = chapterIds.indexOf(over.id);
      onReorderChapters(oldIndex, newIndex);
    }
  };

  return (
    <aside className="w-80 box-border h-full bg-white flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-sm text-slate-600 hover:text-violet-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h2 className="text-base font-semibold text-slate-800 mt-4 truncate">
              {book?.title}
            </h2>
            <p className="text-xs text-slate-500 truncate">
              {book?.author || "Unknown Author"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapterIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {(book?.chapters || []).map((chapter, index) => (
                <SortableItem
                  key={chapter._id || `new-${index}`}
                  chapter={chapter}
                  index={index}
                  selectedChapterIndex={selectedChapterIndex}
                  onSelectChapter={onSelectChapter}
                  onDeleteChapter={onDeleteChapter}
                  onGenerateChapterContent={onGenerateChapterContent}
                  isGenerating={isGenerating}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <Button
          variant="secondary"
          onClick={onAddChapter}
          className="w-full bg-linear-to-r from-violet-500 to-purple-600 text-white font-medium rounded-lg shadow-sm"
          icon={Plus}
        >
          New Chapter
        </Button>
      </div>
    </aside>
  );
};

export default ChapterSidebar;
