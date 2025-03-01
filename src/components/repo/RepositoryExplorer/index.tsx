"use client";

import { useState } from "react";
import { LuFileJson2 } from "react-icons/lu";

import { RepoItem } from "@/types/github";

import FileExplorer from "./FileExplorer";
import FileViewer from "./FileViewer";

interface RepositoryExplorerProps {
  repoFullName: string;
}

export default function RepositoryExplorer({
  repoFullName,
}: RepositoryExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<RepoItem | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <div className="lg:min-h-[calc(100vh-20rem)]">
        <FileExplorer
          repoFullName={repoFullName}
          onFileSelect={(file, content) => {
            setSelectedFile(file);
            setFileContent(content);
          }}
        />
      </div>
      <div className="lg:min-h-[calc(100vh-20rem)]">
        {selectedFile ? (
          <FileViewer
            file={selectedFile}
            repoName={repoFullName}
            content={fileContent}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-gray-500">
            <div>
              <LuFileJson2 className="mx-auto size-16 text-gray-400" />
              <h3 className="mt-4 text-16-600 text-gray-900">
                파일을 선택해주세요
              </h3>
              <p className="mt-2 text-14-500 text-gray-500">
                왼쪽 파일 탐색기에서 분석하고 싶은 파일을 선택하세요
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
