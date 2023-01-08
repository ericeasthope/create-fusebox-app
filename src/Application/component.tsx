import * as React from "react";
import "./styles.scss";

// Get Markdown file as string
// MDX-like parsing for JSX
import md from "index.md";
import { createMarkdown, renderKaTeX, renderPrism } from "utils";

const MD = () => {
  React.useEffect(() => {
    renderKaTeX();
    renderPrism();
  }, []);

  return <>{createMarkdown(md, {}, {})}</>;
};

const Application = () => {
  return (
    <main className="Application">
      <MD />
    </main>
  );
};

export default Application;
