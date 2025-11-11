const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
});

function renderMarkdownToHTML(markdown = "") {
  const bodyHTML = md.render(markdown);
  return `<div class="markdown-body">${bodyHTML}</div>`;
}

module.exports = { renderMarkdownToHTML };
