import { MarkdownRenderer } from "../Post/MarjdownRenderer";

export const ContentPreview = ({ content }: { content: string }) => {
  return (
    <div className="border rounded-lg p-4 bg-white overflow-y-auto h-64 prose prose-stone max-w-none">
     <MarkdownRenderer content={content} />
    </div>
  );
};
