import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ContentPreview = ({ content }: { content: string }) => {
  return (
    <div className="border rounded-lg p-4 bg-white overflow-y-auto h-64 prose prose-stone max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || "*La previsualización aparecerá aquí*"}
      </ReactMarkdown>
    </div>
  );
};
