"use client";

import { useState } from "react";
import { LuFileJson2 } from "react-icons/lu";

import { RepoItem } from "@/types/github";

import FileExplorer from "./FileExplorer";
import FileViewer from "./FileViewer";
import RepositorySelector from "./RepositorySelector";

export default function RepositoryExplorer() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<RepoItem | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  return (
    <div className="divide-y divide-gray-200">
      <div className="p-6">
        <RepositorySelector
          selectedRepo={selectedRepo}
          onSelect={setSelectedRepo}
        />
      </div>
      {selectedRepo && (
        <div className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <div className="lg:min-h-[calc(100vh-16rem)]">
            <FileExplorer
              repoFullName={selectedRepo}
              onFileSelect={(file, content) => {
                setSelectedFile(file);
                setFileContent(content);
              }}
            />
          </div>
          <div className="lg:min-h-[calc(100vh-16rem)]">
            {selectedFile ? (
              <FileViewer
                file={selectedFile}
                content={fileContent}
                onAnalyze={() => {
                  // TODO: OpenAI 분석
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-gray-500">
                <div>
                  <LuFileJson2 className="mx-auto size-30 text-gray-400" />
                  <h3 className="mt-2 text-14-600  text-gray-900">
                    선택된 파일이 없습니다.
                  </h3>
                  <p className="mt-1 text-14-500 text-gray-500">
                    파일을 고르고 확인하세요!!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
