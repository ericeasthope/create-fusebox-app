import React from "react";
import marked from "marked";
import parse from "html-react-parser";
import matter from "gray-matter";

const createMarkdown = (md, components, images) => {
  // Split frontmatter from Markdown body
  let { data: metadata, content } = matter(md.trim());

  const head = `
  ${metadata.title ? `# ${metadata.title}` : ""}
  ${metadata.authors ? `## ${metadata.authors}` : ""}
  ${metadata.institution ? `#### ${metadata.institution}` : ""}
  ${metadata.note ? `> _${metadata.note}_` : ""}

  `;

  // Add head if metadata exists
  if (head.trim().length) content = head + content;

  try {
    // Update image links with imported ones if they are added to `images`
    if (Object.keys(images).length) {
      content = content.replace(/src=".\/.*\/(.*?)"/g, (match, $1) => {
        let [filename, extension] = $1.split(".");
        console.log($1);
        return `src="${images[filename]}"`;
      });

      content = content.replace(/]\(.\/.*\/(.*?)\)/g, (match, $1) => {
        let [filename, extension] = $1.split(".");
        console.log($1);
        return `](${images[filename]})`;
      });
    }
  } catch (e) {
    console.log(e);
  }

  // Escape backslashes for KaTeX
  content = content.replace(/\\/g, "\\\\");

  const html = marked(content);
  return parse(html, {
    replace: (domNode) => {
      const [child] = domNode.children || [];
      if (
        domNode.type === "tag" &&
        child &&
        child.type === "tag" &&
        child.name === "code"
      ) {
        const [childOfChild] = child.children || [];
        if (
          childOfChild &&
          childOfChild.data.startsWith("<") &&
          childOfChild.data.endsWith("/>")
        ) {
          const component = childOfChild.data;
          const name = component.slice(1).split(" ")[0];

          try {
            return React.createElement(
              components[name],
              {
                /* Can add props here later... */
              },
              null
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
  });
};

const renderKaTeX = () => {
  const main = document.querySelector("main");
  window.renderMathInElement
    ? window.renderMathInElement(main, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      })
    : window.requestAnimationFrame(renderKaTeX);
};

const renderPrism = () => {
  const main = document.querySelector("main");
  window.Prism
    ? Prism.highlightAllUnder(main)
    : window.requestAnimationFrame(renderPrism);
};

export { createMarkdown, renderPrism, renderKaTeX };
