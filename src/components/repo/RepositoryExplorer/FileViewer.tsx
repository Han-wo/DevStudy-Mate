import { LuFileJson2 } from "react-icons/lu";

import { RepoItem } from "@/types/github";

interface FileViewerProps {
  file: RepoItem;
  content: string | null;
  onAnalyze: () => void;
}

export default function FileViewer({
  file,
  content,
  onAnalyze,
}: FileViewerProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <LuFileJson2 className="size-15 text-gray-400" />
          <div>
            <h3 className="font-medium text-gray-900">{file.name}</h3>
          </div>
        </div>
        <button
          type="submit"
          onClick={onAnalyze}
          className="shadow-sm inline-flex items-center rounded-md bg-blue-600 px-8 py-5 text-14-600  text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          분석하기
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="rounded-lg bg-gray-50 p-4 text-14-500">
          <code className="whitespace-pre-wrap font-mono text-gray-800">
            {content}
          </code>
        </pre>
      </div>
    </div>
  );
}
