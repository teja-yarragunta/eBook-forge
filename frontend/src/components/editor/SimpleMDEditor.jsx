import React from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { Type } from "lucide-react";

/**
 * SimpleMDEditor wrapper:
 * - forces light theme / white background for edit and preview.
 * - sets textarea to wrap and break words.
 * - default preview="edit" which is split (edit + preview); user can toggle to full preview using editor toolbar.
 */
const SimpleMDEditor = ({ value, onChange, options = {} }) => {
  // textareaProps override (spellCheck, wrap, styling)
  const textareaProps = {
    spellCheck: true,
    wrap: "soft",
    style: {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      backgroundColor: "#ffffff",
      color: "#111827",
    },
  };

  return (
    <div
      className="border border-gray-200 rounded-md overflow-hidden shadow-sm bg-white"
      data-color-mode="light"
    >
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 text-sm text-gray-700 flex items-center gap-2">
        <Type className="w-4 h-4" />
        <span>Markdown Editor</span>
      </div>

      <div className="p-2 bg-white">
        <MDEditor
          value={value}
          onChange={onChange}
          preview="edit" // split view by default (editor + preview). Toolbar controls will allow preview-only/fullscreen.
          height={520}
          commands={[
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.hr,
            commands.title,
            commands.divider,
            commands.link,
            commands.code,
            commands.image,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
          ]}
          textareaProps={{ ...textareaProps, ...(options.textareaProps || {}) }}
          className="bg-white! text-gray-900!"
          // pass other options
          {...options}
        />
      </div>
    </div>
  );
};

export default SimpleMDEditor;
