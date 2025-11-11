// const {
//   Document,
//   Packer,
//   Paragraph,
//   TextRun,
//   HeadingLevel,
//   AlignmentType,
//   UnderlineType,
//   ImageRun,
// } = require("docx");
// const PDFDocument = require("pdfkit");
// const MarkdownIt = require("markdown-it");
// const path = require("path");
// const fs = require("fs");
// const md = new MarkdownIt({
//   html: true,
//   breaks: true,
//   linkify: true,
// });

// const bookModel = require("../models/Book");

// // Typography configuration matching the PDF export
// const DOCX_STYLES = {
//   fonts: {
//     body: "Times New Roman",
//     heading: "Times New Roman",
//   },
//   sizes: {
//     title: 32,
//     subtitle: 20,
//     author: 18,
//     chapterTitle: 24,
//     h1: 20,
//     h2: 18,
//     h3: 16,
//     body: 12,
//   },
//   spacing: {
//     paragraphBefore: 0,
//     paragraphAfter: 200,
//     chapterBefore: 600,
//     chapterAfter: 400,
//     headingBefore: 300,
//     headingAfter: 150,
//   },
//   indent: {
//     firstLine: 360, // 0.25 inch equivalent
//   },
// };

// // PDF styles configuration
// const PDF_STYLES = {
//   fonts: {
//     body: "Times-Roman",
//     heading: "Times-Bold",
//   },
//   sizes: {
//     title: 32,
//     subtitle: 20,
//     author: 18,
//     chapterTitle: 24,
//     h1: 20,
//     h2: 18,
//     h3: 16,
//     body: 12,
//   },
//   colors: {
//     title: "#1A202C",
//     subtitle: "#4A5568",
//     author: "#2D3748",
//     heading: "#1A202C",
//     body: "#000000",
//     accent: "#4F46E5",
//   },
//   margins: {
//     top: 72, // 1 inch
//     bottom: 72,
//     left: 72,
//     right: 72,
//   },
//   spacing: {
//     paragraph: 12,
//     heading: 24,
//     chapter: 36,
//   },
//   indent: {
//     firstLine: 18, // 0.25 inch equivalent
//   },
// };

// // Helper function to parse inline tokens to TextRuns
// const parseInlineTokens = (tokens) => {
//   const runs = [];
//   if (!tokens || tokens.length === 0) return runs;

//   for (const token of tokens) {
//     if (token.type === "text") {
//       runs.push(
//         new TextRun({
//           text: token.content,
//           font: DOCX_STYLES.fonts.body,
//           size: DOCX_STYLES.sizes.body * 2,
//         })
//       );
//     } else if (token.type === "strong_open") {
//       // Find corresponding strong_close
//       let idx = tokens.indexOf(token);
//       let content = "";
//       for (let i = idx + 1; i < tokens.length; i++) {
//         if (tokens[i].type === "strong_close") break;
//         if (tokens[i].type === "text") content += tokens[i].content;
//       }
//       if (content) {
//         runs.push(
//           new TextRun({
//             text: content,
//             bold: true,
//             font: DOCX_STYLES.fonts.body,
//             size: DOCX_STYLES.sizes.body * 2,
//           })
//         );
//       }
//     } else if (token.type === "em_open") {
//       let idx = tokens.indexOf(token);
//       let content = "";
//       for (let i = idx + 1; i < tokens.length; i++) {
//         if (tokens[i].type === "em_close") break;
//         if (tokens[i].type === "text") content += tokens[i].content;
//       }
//       if (content) {
//         runs.push(
//           new TextRun({
//             text: content,
//             italics: true,
//             font: DOCX_STYLES.fonts.body,
//             size: DOCX_STYLES.sizes.body * 2,
//           })
//         );
//       }
//     } else if (token.type === "code_inline") {
//       runs.push(
//         new TextRun({
//           text: token.content,
//           font: "Courier New",
//           size: DOCX_STYLES.sizes.body * 2,
//         })
//       );
//     } else if (token.type === "link_open") {
//       const href = token.attrs?.find((attr) => attr[0] === "href")?.[1] || "";
//       let idx = tokens.indexOf(token);
//       let content = "";
//       for (let i = idx + 1; i < tokens.length; i++) {
//         if (tokens[i].type === "link_close") break;
//         if (tokens[i].type === "text") content += tokens[i].content;
//       }
//       runs.push(
//         new TextRun({
//           text: content || href,
//           color: "0563C1",
//           underline: {
//             type: UnderlineType.SINGLE,
//           },
//           font: DOCX_STYLES.fonts.body,
//           size: DOCX_STYLES.sizes.body * 2,
//         })
//       );
//     }
//   }
//   return runs;
// };

// // Convert markdown to docx-compatible Paragraphs
// const processMarkdownToDocx = (markdown, isFirstParagraph = false) => {
//   if (!markdown || markdown.trim() === "") {
//     return [
//       new Paragraph({
//         text: "",
//         spacing: { after: DOCX_STYLES.spacing.paragraphAfter },
//       }),
//     ];
//   }

//   const tokens = md.parse(markdown, {});
//   const paragraphs = [];
//   let isFirstPara = isFirstParagraph;

//   for (let i = 0; i < tokens.length; i++) {
//     const token = tokens[i];

//     try {
//       if (token.type === "heading_open") {
//         const level = parseInt(token.tag.substring(1)); // h1, h2, h3 -> 1, 2, 3
//         const headingToken = tokens[i + 1];
//         let headingText = "";

//         if (headingToken && headingToken.children) {
//           headingText = headingToken.children
//             .map((child) => child.content || "")
//             .join("");
//         }

//         if (headingText) {
//           let headingSize = DOCX_STYLES.sizes.h1 * 2;
//           if (level === 2) headingSize = DOCX_STYLES.sizes.h2 * 2;
//           if (level === 3) headingSize = DOCX_STYLES.sizes.h3 * 2;

//           paragraphs.push(
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: headingText,
//                   bold: true,
//                   font: DOCX_STYLES.fonts.heading,
//                   size: headingSize,
//                   color: "1A202C",
//                 }),
//               ],
//               heading:
//                 level === 1
//                   ? HeadingLevel.HEADING_1
//                   : level === 2
//                   ? HeadingLevel.HEADING_2
//                   : HeadingLevel.HEADING_3,
//               spacing: {
//                 before: DOCX_STYLES.spacing.headingBefore,
//                 after: DOCX_STYLES.spacing.headingAfter,
//               },
//             })
//           );
//         }
//         i++; // Skip heading_close token
//       } else if (token.type === "paragraph_open") {
//         const paraToken = tokens[i + 1];
//         let textRuns = [];

//         if (paraToken && paraToken.children) {
//           textRuns = parseInlineTokens(paraToken.children);
//         }

//         if (textRuns.length === 0) {
//           textRuns.push(
//             new TextRun({
//               text: "",
//               font: DOCX_STYLES.fonts.body,
//               size: DOCX_STYLES.sizes.body * 2,
//             })
//           );
//         }

//         paragraphs.push(
//           new Paragraph({
//             children: textRuns,
//             alignment: AlignmentType.JUSTIFIED,
//             spacing: {
//               before: DOCX_STYLES.spacing.paragraphBefore,
//               after: DOCX_STYLES.spacing.paragraphAfter,
//             },
//             indent: !isFirstPara
//               ? {
//                   firstLine: DOCX_STYLES.indent.firstLine,
//                 }
//               : undefined,
//           })
//         );
//         isFirstPara = false; // After first paragraph, all subsequent paragraphs get indented
//         i++; // Skip paragraph_close
//       } else if (token.type === "bullet_list_open") {
//         // Handle unordered list
//         let listItems = [];
//         let j = i + 1;
//         while (j < tokens.length && tokens[j].type !== "bullet_list_close") {
//           if (tokens[j].type === "list_item_open") {
//             j++; // Skip list_item_open
//             const itemToken = tokens[j];
//             let itemText = "";

//             if (itemToken && itemToken.children) {
//               // Find paragraph content
//               for (const child of itemToken.children) {
//                 if (child.type === "paragraph_open") {
//                   const paraChildren = tokens[j + 1]?.children || [];
//                   itemText = paraChildren.map((c) => c.content || "").join("");
//                   break;
//                 }
//               }
//             }

//             if (itemText) {
//               listItems.push(itemText);
//             }

//             // Skip to list_item_close
//             while (j < tokens.length && tokens[j].type !== "list_item_close") {
//               j++;
//             }
//           }
//           j++;
//         }

//         // Add list items as paragraphs with bullet points
//         listItems.forEach((item) => {
//           paragraphs.push(
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: "• ",
//                   bold: true,
//                   font: DOCX_STYLES.fonts.body,
//                   size: DOCX_STYLES.sizes.body * 2,
//                 }),
//                 new TextRun({
//                   text: item,
//                   font: DOCX_STYLES.fonts.body,
//                   size: DOCX_STYLES.sizes.body * 2,
//                 }),
//               ],
//               alignment: AlignmentType.JUSTIFIED,
//               spacing: {
//                 before: 100,
//                 after: 100,
//               },
//               indent: {
//                 left: 400,
//               },
//             })
//           );
//         });

//         // Skip to bullet_list_close
//         while (i < tokens.length && tokens[i].type !== "bullet_list_close") {
//           i++;
//         }
//       } else if (token.type === "ordered_list_open") {
//         // Handle ordered list
//         let listItems = [];
//         let counter = 1;
//         let j = i + 1;
//         while (j < tokens.length && tokens[j].type !== "ordered_list_close") {
//           if (tokens[j].type === "list_item_open") {
//             j++; // Skip list_item_open
//             const itemToken = tokens[j];
//             let itemText = "";

//             if (itemToken && itemToken.children) {
//               for (const child of itemToken.children) {
//                 if (child.type === "paragraph_open") {
//                   const paraChildren = tokens[j + 1]?.children || [];
//                   itemText = paraChildren.map((c) => c.content || "").join("");
//                   break;
//                 }
//               }
//             }

//             if (itemText) {
//               listItems.push({ number: counter++, text: itemText });
//             }

//             while (j < tokens.length && tokens[j].type !== "list_item_close") {
//               j++;
//             }
//           }
//           j++;
//         }

//         // Add list items as paragraphs with numbers
//         listItems.forEach((item) => {
//           paragraphs.push(
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: `${item.number}. `,
//                   bold: true,
//                   font: DOCX_STYLES.fonts.body,
//                   size: DOCX_STYLES.sizes.body * 2,
//                 }),
//                 new TextRun({
//                   text: item.text,
//                   font: DOCX_STYLES.fonts.body,
//                   size: DOCX_STYLES.sizes.body * 2,
//                 }),
//               ],
//               alignment: AlignmentType.JUSTIFIED,
//               spacing: {
//                 before: 100,
//                 after: 100,
//               },
//               indent: {
//                 left: 400,
//               },
//             })
//           );
//         });

//         // Skip to ordered_list_close
//         while (i < tokens.length && tokens[i].type !== "ordered_list_close") {
//           i++;
//         }
//       } else if (token.type === "code_block_open") {
//         // Handle code blocks
//         const codeToken = tokens[i + 1];
//         let codeText = codeToken?.content || "";

//         if (codeText) {
//           paragraphs.push(
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: codeText,
//                   font: "Courier New",
//                   size: DOCX_STYLES.sizes.body * 2,
//                 }),
//               ],
//               spacing: {
//                 before: DOCX_STYLES.spacing.paragraphBefore,
//                 after: DOCX_STYLES.spacing.paragraphAfter,
//               },
//               shading: {
//                 fill: "F5F5F5",
//               },
//               indent: {
//                 left: 200,
//                 right: 200,
//               },
//             })
//           );
//         }
//         i++; // Skip code_block_close
//       } else if (token.type === "hr") {
//         // Horizontal rule
//         paragraphs.push(
//           new Paragraph({
//             text: "",
//             border: {
//               bottom: {
//                 color: "CCCCCC",
//                 space: 1,
//                 style: "single",
//                 size: 6,
//               },
//             },
//             spacing: {
//               before: DOCX_STYLES.spacing.paragraphBefore,
//               after: DOCX_STYLES.spacing.paragraphAfter,
//             },
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Error processing markdown token:", error);
//     }
//   }

//   // If no paragraphs were created, add empty paragraph
//   if (paragraphs.length === 0) {
//     paragraphs.push(
//       new Paragraph({
//         text: "",
//         spacing: { after: DOCX_STYLES.spacing.paragraphAfter },
//       })
//     );
//   }

//   return paragraphs;
// };

// // Export book as DOCX document
// const exportAsDocument = async (req, res) => {
//   try {
//     const book = await bookModel.findById(req.params.id);

//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     if (book.userId.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const sections = [];

//     // Cover page with image if available
//     const coverPage = [];
//     if (book.coverImage && !book.coverImage.includes("pravatar")) {
//       const imagePath = book.coverImage.substring(1);
//       try {
//         if (fs.existsSync(imagePath)) {
//           const imageBuffer = fs.readFileSync(imagePath);

//           // Add some top spacing
//           coverPage.push(
//             new Paragraph({
//               text: "",
//               spacing: { before: 1000 },
//             })
//           );

//           // Add image centered on page
//           coverPage.push(
//             new Paragraph({
//               children: [
//                 new ImageRun({
//                   data: imageBuffer,
//                   transformation: {
//                     width: 400, // Width in pixels
//                     height: 550, // Height in pixels
//                   },
//                 }),
//               ],
//               alignment: AlignmentType.CENTER,
//               spacing: { before: 200, after: 400 },
//             })
//           );

//           // Page break after cover
//           coverPage.push(
//             new Paragraph({
//               text: "",
//               pageBreakBefore: true,
//             })
//           );
//         }
//       } catch (imgErr) {
//         console.error(`Could not embed image: ${imagePath}`, imgErr);
//       }
//     }

//     sections.push(...coverPage);

//     // Title page section
//     const titlePage = [];

//     // Main title
//     titlePage.push(
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: book.title,
//             bold: true,
//             font: DOCX_STYLES.fonts.heading,
//             size: DOCX_STYLES.sizes.title * 2,
//             color: "1A202C",
//           }),
//         ],
//         alignment: AlignmentType.CENTER,
//         spacing: { before: 2000, after: 400 },
//       })
//     );

//     // Subtitle if exists
//     if (book.subtitle && book.subtitle.trim()) {
//       titlePage.push(
//         new Paragraph({
//           children: [
//             new TextRun({
//               text: book.subtitle,
//               font: DOCX_STYLES.fonts.heading,
//               size: DOCX_STYLES.sizes.subtitle * 2,
//               color: "4A5568",
//             }),
//           ],
//           alignment: AlignmentType.CENTER,
//           spacing: { after: 400 },
//         })
//       );
//     }

//     // Author
//     titlePage.push(
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: `by ${book.author}`,
//             font: DOCX_STYLES.fonts.heading,
//             size: DOCX_STYLES.sizes.author * 2,
//             color: "2D3748",
//           }),
//         ],
//         alignment: AlignmentType.CENTER,
//         spacing: { after: 200 },
//       })
//     );

//     // Decorative line
//     titlePage.push(
//       new Paragraph({
//         text: "",
//         border: {
//           bottom: {
//             color: "4F46E5",
//             space: 1,
//             style: "single",
//             size: 12,
//           },
//         },
//         alignment: AlignmentType.CENTER,
//         spacing: { before: 400 },
//       })
//     );

//     sections.push(...titlePage);

//     // Process chapters
//     book.chapters.forEach((chapter, index) => {
//       try {
//         // Page break before each chapter (including first)
//         sections.push(
//           new Paragraph({
//             text: "",
//             pageBreakBefore: true,
//           })
//         );

//         // Chapter title
//         sections.push(
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: chapter.title,
//                 bold: true,
//                 font: DOCX_STYLES.fonts.heading,
//                 size: DOCX_STYLES.sizes.chapterTitle * 2,
//                 color: "1A202C",
//               }),
//             ],
//             alignment: AlignmentType.LEFT,
//             spacing: {
//               before: DOCX_STYLES.spacing.chapterBefore,
//               after: DOCX_STYLES.spacing.chapterAfter,
//             },
//           })
//         );

//         // Chapter content - first paragraph has no indent
//         const contentParagraphs = processMarkdownToDocx(
//           chapter.content || "",
//           true
//         );
//         sections.push(...contentParagraphs);
//       } catch (chapterError) {
//         console.error(`Error processing chapter ${index}: `, chapterError);
//       }
//     });

//     // Create a document
//     const doc = new Document({
//       sections: [
//         {
//           properties: {
//             page: {
//               margin: {
//                 top: 1440, // 1 inch
//                 right: 1440,
//                 left: 1440,
//                 bottom: 1440,
//               },
//             },
//           },
//           children: sections,
//         },
//       ],
//     });

//     // Generate the document buffer
//     const buffer = await Packer.toBuffer(doc);

//     // Send the document
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`
//     );
//     res.setHeader("Content-Length", buffer.length);
//     res.send(buffer);
//   } catch (error) {
//     console.error("Error exporting document: ", error);
//     if (!res.headersSent) {
//       res.status(500).json({
//         message: "Server error during document export",
//         error: error.message,
//       });
//     }
//   }
// };

// // Helper function to process markdown content and write to PDF
// const processMarkdownToPDF = (
//   doc,
//   markdown,
//   yPosition,
//   isFirstParagraph = false
// ) => {
//   if (!markdown || markdown.trim() === "") {
//     return yPosition + PDF_STYLES.spacing.paragraph;
//   }

//   const tokens = md.parse(markdown, {});
//   let currentY = yPosition;
//   let isFirstPara = isFirstParagraph;

//   for (let i = 0; i < tokens.length; i++) {
//     const token = tokens[i];

//     try {
//       if (token.type === "heading_open") {
//         const level = parseInt(token.tag.substring(1));
//         const headingToken = tokens[i + 1];
//         let headingText = "";

//         if (headingToken && headingToken.children) {
//           headingText = headingToken.children
//             .map((child) => child.content || "")
//             .join("");
//         }

//         if (headingText) {
//           // Check if we need a new page
//           if (currentY > doc.page.height - 200) {
//             doc.addPage();
//             currentY = PDF_STYLES.margins.top;
//           }

//           let headingSize = PDF_STYLES.sizes.h1;
//           if (level === 2) headingSize = PDF_STYLES.sizes.h2;
//           if (level === 3) headingSize = PDF_STYLES.sizes.h3;

//           currentY += PDF_STYLES.spacing.heading;
//           doc
//             .font(PDF_STYLES.fonts.heading)
//             .fontSize(headingSize)
//             .fillColor(PDF_STYLES.colors.heading)
//             .text(headingText, PDF_STYLES.margins.left, currentY, {
//               width:
//                 doc.page.width -
//                 PDF_STYLES.margins.left -
//                 PDF_STYLES.margins.right,
//               align: "left",
//             });

//           currentY += headingSize + PDF_STYLES.spacing.heading;
//           i++; // Skip heading_close
//         }
//       } else if (token.type === "paragraph_open") {
//         const paraToken = tokens[i + 1];
//         let text = "";

//         if (paraToken && paraToken.children) {
//           text = paraToken.children
//             .map((child) => {
//               if (child.type === "text") return child.content || "";
//               if (child.type === "strong_open") return "";
//               if (child.type === "strong_close") return "";
//               if (child.type === "em_open") return "";
//               if (child.type === "em_close") return "";
//               if (child.type === "code_inline") return child.content || "";
//               if (child.type === "link_open") {
//                 const linkText =
//                   child.children?.find((c) => c.type === "text")?.content || "";
//                 return linkText;
//               }
//               return "";
//             })
//             .join("");
//         }

//         if (text.trim()) {
//           // Check if we need a new page
//           if (currentY > doc.page.height - 200) {
//             doc.addPage();
//             currentY = PDF_STYLES.margins.top;
//           }

//           currentY += PDF_STYLES.spacing.paragraph;

//           // Calculate text position with first-line indent for subsequent paragraphs
//           const textX =
//             PDF_STYLES.margins.left +
//             (isFirstPara ? 0 : PDF_STYLES.indent.firstLine);
//           const textWidth =
//             doc.page.width -
//             PDF_STYLES.margins.left -
//             PDF_STYLES.margins.right -
//             (isFirstPara ? 0 : PDF_STYLES.indent.firstLine);

//           doc
//             .font(PDF_STYLES.fonts.body)
//             .fontSize(PDF_STYLES.sizes.body)
//             .fillColor(PDF_STYLES.colors.body)
//             .text(text, textX, currentY, {
//               width: textWidth,
//               align: "justify",
//             });

//           // Get actual height of text
//           const textHeight = doc.heightOfString(text, {
//             width: textWidth,
//           });
//           currentY += textHeight + PDF_STYLES.spacing.paragraph;
//           isFirstPara = false; // After first paragraph, all subsequent paragraphs get indented
//         }
//         i++; // Skip paragraph_close
//       } else if (token.type === "bullet_list_open") {
//         let listItems = [];
//         let j = i + 1;
//         while (j < tokens.length && tokens[j].type !== "bullet_list_close") {
//           if (tokens[j].type === "list_item_open") {
//             j++;
//             const itemToken = tokens[j];
//             let itemText = "";

//             if (itemToken && itemToken.children) {
//               for (const child of itemToken.children) {
//                 if (child.type === "paragraph_open") {
//                   const paraChildren = tokens[j + 1]?.children || [];
//                   itemText = paraChildren.map((c) => c.content || "").join("");
//                   break;
//                 }
//               }
//             }

//             if (itemText) {
//               listItems.push(itemText);
//             }

//             while (j < tokens.length && tokens[j].type !== "list_item_close") {
//               j++;
//             }
//           }
//           j++;
//         }

//         listItems.forEach((item) => {
//           if (currentY > doc.page.height - 200) {
//             doc.addPage();
//             currentY = PDF_STYLES.margins.top;
//           }

//           currentY += PDF_STYLES.spacing.paragraph;
//           doc
//             .font(PDF_STYLES.fonts.body)
//             .fontSize(PDF_STYLES.sizes.body)
//             .fillColor(PDF_STYLES.colors.body)
//             .text(`• ${item}`, PDF_STYLES.margins.left + 20, currentY, {
//               width:
//                 doc.page.width -
//                 PDF_STYLES.margins.left -
//                 PDF_STYLES.margins.right -
//                 20,
//               align: "justify",
//             });

//           const textHeight = doc.heightOfString(`• ${item}`, {
//             width:
//               doc.page.width -
//               PDF_STYLES.margins.left -
//               PDF_STYLES.margins.right -
//               20,
//           });
//           currentY += textHeight + PDF_STYLES.spacing.paragraph;
//         });

//         while (i < tokens.length && tokens[i].type !== "bullet_list_close") {
//           i++;
//         }
//       } else if (token.type === "ordered_list_open") {
//         let listItems = [];
//         let counter = 1;
//         let j = i + 1;
//         while (j < tokens.length && tokens[j].type !== "ordered_list_close") {
//           if (tokens[j].type === "list_item_open") {
//             j++;
//             const itemToken = tokens[j];
//             let itemText = "";

//             if (itemToken && itemToken.children) {
//               for (const child of itemToken.children) {
//                 if (child.type === "paragraph_open") {
//                   const paraChildren = tokens[j + 1]?.children || [];
//                   itemText = paraChildren.map((c) => c.content || "").join("");
//                   break;
//                 }
//               }
//             }

//             if (itemText) {
//               listItems.push({ number: counter++, text: itemText });
//             }

//             while (j < tokens.length && tokens[j].type !== "list_item_close") {
//               j++;
//             }
//           }
//           j++;
//         }

//         listItems.forEach((item) => {
//           if (currentY > doc.page.height - 200) {
//             doc.addPage();
//             currentY = PDF_STYLES.margins.top;
//           }

//           currentY += PDF_STYLES.spacing.paragraph;
//           doc
//             .font(PDF_STYLES.fonts.body)
//             .fontSize(PDF_STYLES.sizes.body)
//             .fillColor(PDF_STYLES.colors.body)
//             .text(
//               `${item.number}. ${item.text}`,
//               PDF_STYLES.margins.left + 20,
//               currentY,
//               {
//                 width:
//                   doc.page.width -
//                   PDF_STYLES.margins.left -
//                   PDF_STYLES.margins.right -
//                   20,
//                 align: "justify",
//               }
//             );

//           const textHeight = doc.heightOfString(
//             `${item.number}. ${item.text}`,
//             {
//               width:
//                 doc.page.width -
//                 PDF_STYLES.margins.left -
//                 PDF_STYLES.margins.right -
//                 20,
//             }
//           );
//           currentY += textHeight + PDF_STYLES.spacing.paragraph;
//         });

//         while (i < tokens.length && tokens[i].type !== "ordered_list_close") {
//           i++;
//         }
//       } else if (token.type === "code_block_open") {
//         const codeToken = tokens[i + 1];
//         let codeText = codeToken?.content || "";

//         if (codeText) {
//           if (currentY > doc.page.height - 200) {
//             doc.addPage();
//             currentY = PDF_STYLES.margins.top;
//           }

//           currentY += PDF_STYLES.spacing.paragraph;
//           doc
//             .font("Courier")
//             .fontSize(PDF_STYLES.sizes.body - 1)
//             .fillColor(PDF_STYLES.colors.body)
//             .text(codeText, PDF_STYLES.margins.left + 20, currentY, {
//               width:
//                 doc.page.width -
//                 PDF_STYLES.margins.left -
//                 PDF_STYLES.margins.right -
//                 40,
//               align: "left",
//             });

//           const textHeight = doc.heightOfString(codeText, {
//             width:
//               doc.page.width -
//               PDF_STYLES.margins.left -
//               PDF_STYLES.margins.right -
//               40,
//           });
//           currentY += textHeight + PDF_STYLES.spacing.paragraph;
//         }
//         i++; // Skip code_block_close
//       } else if (token.type === "hr") {
//         if (currentY > doc.page.height - 200) {
//           doc.addPage();
//           currentY = PDF_STYLES.margins.top;
//         }

//         currentY += PDF_STYLES.spacing.paragraph;
//         doc
//           .moveTo(PDF_STYLES.margins.left, currentY)
//           .lineTo(doc.page.width - PDF_STYLES.margins.right, currentY)
//           .strokeColor("#CCCCCC")
//           .lineWidth(1)
//           .stroke();

//         currentY += PDF_STYLES.spacing.paragraph * 2;
//       }
//     } catch (error) {
//       console.error("Error processing markdown token for PDF:", error);
//     }
//   }

//   return currentY;
// };

// // Export book as PDF document
// const exportAsPDF = async (req, res) => {
//   try {
//     const book = await bookModel.findById(req.params.id);

//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     if (book.userId.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     // Create PDF document
//     const doc = new PDFDocument({
//       size: "LETTER",
//       margins: PDF_STYLES.margins,
//     });

//     // Collect PDF data into buffer
//     const chunks = [];
//     doc.on("data", (chunk) => chunks.push(chunk));
//     doc.on("end", () => {
//       const buffer = Buffer.concat(chunks);
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
//       );
//       res.setHeader("Content-Length", buffer.length);
//       res.send(buffer);
//     });

//     let yPosition = PDF_STYLES.margins.top;

//     // Cover page with image if available
//     if (book.coverImage && !book.coverImage.includes("pravatar")) {
//       const imagePath = book.coverImage.substring(1);
//       try {
//         if (fs.existsSync(imagePath)) {
//           // Add cover image
//           const imageWidth = 300;
//           const imageHeight = 400;
//           const xPosition = (doc.page.width - imageWidth) / 2;
//           yPosition = 150;

//           doc.image(imagePath, xPosition, yPosition, {
//             width: imageWidth,
//             height: imageHeight,
//             align: "center",
//           });

//           yPosition += imageHeight + 100;
//         }
//       } catch (imgErr) {
//         console.error(`Could not embed image: ${imagePath}`, imgErr);
//       }
//     }

//     // Add new page for title page
//     doc.addPage();
//     yPosition = PDF_STYLES.margins.top + 200;

//     // Main title
//     doc
//       .font(PDF_STYLES.fonts.heading)
//       .fontSize(PDF_STYLES.sizes.title)
//       .fillColor(PDF_STYLES.colors.title)
//       .text(book.title, PDF_STYLES.margins.left, yPosition, {
//         width:
//           doc.page.width - PDF_STYLES.margins.left - PDF_STYLES.margins.right,
//         align: "center",
//       });

//     yPosition += PDF_STYLES.sizes.title + 30;

//     // Subtitle if exists
//     if (book.subtitle && book.subtitle.trim()) {
//       doc
//         .font(PDF_STYLES.fonts.body)
//         .fontSize(PDF_STYLES.sizes.subtitle)
//         .fillColor(PDF_STYLES.colors.subtitle)
//         .text(book.subtitle, PDF_STYLES.margins.left, yPosition, {
//           width:
//             doc.page.width - PDF_STYLES.margins.left - PDF_STYLES.margins.right,
//           align: "center",
//         });

//       yPosition += PDF_STYLES.sizes.subtitle + 30;
//     }

//     // Author
//     doc
//       .font(PDF_STYLES.fonts.body)
//       .fontSize(PDF_STYLES.sizes.author)
//       .fillColor(PDF_STYLES.colors.author)
//       .text(`by ${book.author}`, PDF_STYLES.margins.left, yPosition, {
//         width:
//           doc.page.width - PDF_STYLES.margins.left - PDF_STYLES.margins.right,
//         align: "center",
//       });

//     yPosition += PDF_STYLES.sizes.author + 50;

//     // Decorative line
//     const lineY = yPosition;
//     doc
//       .moveTo(PDF_STYLES.margins.left + 100, lineY)
//       .lineTo(doc.page.width - PDF_STYLES.margins.right - 100, lineY)
//       .strokeColor(PDF_STYLES.colors.accent)
//       .lineWidth(2)
//       .stroke();

//     // Process chapters
//     for (let index = 0; index < book.chapters.length; index++) {
//       const chapter = book.chapters[index];

//       try {
//         // Add new page for each chapter (including first)
//         doc.addPage();
//         yPosition = PDF_STYLES.margins.top + PDF_STYLES.spacing.chapter;

//         // Chapter title
//         doc
//           .font(PDF_STYLES.fonts.heading)
//           .fontSize(PDF_STYLES.sizes.chapterTitle)
//           .fillColor(PDF_STYLES.colors.heading)
//           .text(chapter.title, PDF_STYLES.margins.left, yPosition, {
//             width:
//               doc.page.width -
//               PDF_STYLES.margins.left -
//               PDF_STYLES.margins.right,
//             align: "left",
//           });

//         yPosition += PDF_STYLES.sizes.chapterTitle + PDF_STYLES.spacing.chapter;

//         // Chapter content - first paragraph has no indent
//         yPosition = processMarkdownToPDF(
//           doc,
//           chapter.content || "",
//           yPosition,
//           true
//         );
//       } catch (chapterError) {
//         console.error(`Error processing chapter ${index}: `, chapterError);
//       }
//     }

//     // Finalize PDF
//     doc.end();
//   } catch (error) {
//     console.error("Error exporting PDF: ", error);
//     if (!res.headersSent) {
//       res.status(500).json({
//         message: "Server error during PDF export",
//         error: error.message,
//       });
//     }
//   }
// };

// module.exports = { exportAsDocument, exportAsPDF };

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const HTMLtoDOCX = require("html-to-docx");
const { renderMarkdownToHTML } = require("../utils/exportHelpers");
const bookModel = require("../models/Book");

// Helper: Convert image path to base64
function imageToBase64(imgPath) {
  try {
    if (imgPath.startsWith("http")) return imgPath; // external URL, use as-is
    const fullPath = path.join(
      process.cwd(),
      imgPath.startsWith("/") ? imgPath.slice(1) : imgPath
    );
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).slice(1);
      const base64 = fs.readFileSync(fullPath).toString("base64");
      return `data:image/${ext};base64,${base64}`;
    }
    return null;
  } catch (err) {
    console.error("Error converting image:", err);
    return null;
  }
}

// Generate full HTML for both exports
function generateBookHTML(book, css = "") {
  let coverImageTag = "";
  const coverSrc = book.coverImage ? imageToBase64(book.coverImage) : null;

  if (coverSrc) {
    coverImageTag = `
      <div style="page-break-after: always; text-align:center; margin-top:50px;">
        <img src="${coverSrc}" style="width:400px; height:auto; border-radius:8px; margin-bottom:40px;" />
      </div>
    `;
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>${book.title}</title>
    ${css ? `<style>${css}</style>` : ""}
  </head>
  <body>
    ${coverImageTag}

    <div style="text-align:center; margin-top:60px;">
      <h1>${book.title}</h1>
      ${book.subtitle ? `<h3>${book.subtitle}</h3>` : ""}
      <p style="margin-top:10px;">by ${book.author}</p>
    </div>

    <hr style="margin:40px 0;"/>

    ${book.chapters
      .map(
        (ch) => `
        <div class="page-break"></div>
        <h2>${ch.title}</h2>
        ${renderMarkdownToHTML(ch.content)}
      `
      )
      .join("")}
  </body>
  </html>
  `;
  return html;
}

/* ------------------ PDF Export ------------------ */
const exportAsPDF = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const css = fs.readFileSync(
      path.join(__dirname, "../utils/exportStyles.css"),
      "utf8"
    );

    const html = generateBookHTML(book, css);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1in", bottom: "1in", left: "1in", right: "1in" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

/* ------------------ DOCX Export ------------------ */
const exportAsDocument = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const html = generateBookHTML(book);

    const buffer = await HTMLtoDOCX(html, null, {
      table: { row: { cantSplit: true } },
      pageNumber: true,
      margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating DOCX" });
  }
};

module.exports = { exportAsPDF, exportAsDocument };
