import { Lightbulb, BookOpen, Download, Library } from "lucide-react";

export const FEATURES = [
  {
    title: "AI-Powered Writing",
    description:
      "Overcome writer's block with our smart assistant that helps you generate ideas, outlines, and content.",
    icon: Lightbulb,
    gradient: "from-violet-400 to-purple-500",
  },
  {
    title: "Immersive Reader",
    description:
      "Preview your ebook in a clean, read-only format. Adjust font sizes for a comfortable reading experience before you export.",
    icon: BookOpen,
    gradient: "from-violet-300 to-purple-400",
  },
  {
    title: "One-Click Export",
    description:
      "Export your ebook to PDF, and DOCX formats instantly, ready for publishing",
    icon: Download,
    gradient: "from-violet-400 to-purple-500",
  },
  {
    title: "eBook Management",
    description:
      "Organize all your ebook projects in a personal dashboard. Easily track progress, edit drafts, and manage your library.",
    icon: Library,
    gradient: "from-violet-300 to-purple-400",
  },
];
