import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopySVG } from "../../../assets/CopySVG";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

import { defaultSchema } from "hast-util-sanitize";

const sanitizeConfig = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      "src",
      "width",
      "height",
      "frameborder",
      "allow",
      "allowfullscreen",
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ["http", "https"], // permitimos http/https, aunque lo ideal es solo https
  },
};



export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [rehypeSanitize, sanitizeConfig],
      ]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (!inline && match) {
            return (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => navigator.clipboard.writeText(codeString)}
                  className="absolute right-4 top-4 text-stone-400 hover:text-stone-300 cursor-pointer"
                >
                    <CopySVG />
                </button>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};