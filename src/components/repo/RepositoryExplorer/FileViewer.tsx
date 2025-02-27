"use client";

import { useState } from "react";
import { LuFileJson2 } from "react-icons/lu";

import useGitHubAuth from "@/hooks/use-auth";
import { createNote } from "@/lib/note";
import { CodeAnalysisResult } from "@/lib/openai";
import { RepoItem } from "@/types/github";

import AnalysisResult from "./AnalysisRsult";
import LoadingState from "./LoadingState";

interface FileViewerProps {
  file: RepoItem;
  repoName: string;
  content: string | null;
}

export default function FileViewer({
  file,
  repoName,
  content,
}: FileViewerProps) {
  const { user } = useGitHubAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CodeAnalysisResult | null>(null);

  // 파일 타입 확인 함수
  const getFileType = (fileName: string): "markdown" | "code" => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    return ["md", "markdown", "txt"].includes(extension) ? "markdown" : "code";
  };

  const fileType = getFileType(file.name);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);

      // Express 서버 API 엔드포인트로 요청 변경
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: content,
        }),
      });

      if (!response.ok) {
        // 서버 응답 에러 처리 개선
        const errorData = await response.json();
        throw new Error(errorData.error || "분석 요청 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async (analysisData: CodeAnalysisResult) => {
    try {
      if (!user) {
        setError("로그인이 필요합니다.");
        return;
      }

      setLoading(true);

      const noteData = {
        userId: user.id.toString(),
        title: `${file.name} 학습 노트`,
        fileName: file.name,
        repoName,
        fileType,
        fileOverview: analysisData.fileOverview,
        learningPoints: analysisData.learningPoints,
        ...(fileType === "code" && {
          techStack: analysisData.techStack,
          codeExplanation: analysisData.codeExplanation,
        }),
        ...(fileType === "markdown" && {
          keyTerms: analysisData.keyTerms,
          sectionSummary: analysisData.sectionSummary,
        }),
        quizzes: analysisData.quizzes,
      };

      const noteId = await createNote(noteData);
      alert(`노트가 성공적으로 저장되었습니다. (ID: ${noteId})`);
    } catch (err) {
      setError("노트 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (analysis) {
    return (
      <AnalysisResult
        analysis={analysis}
        fileType={fileType}
        onClose={() => setAnalysis(null)}
        onSaveNote={handleSaveNote}
      />
    );
  }

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
          type="button"
          onClick={handleAnalyze}
          className="shadow-sm inline-flex items-center rounded-md bg-blue-600 px-8 py-5 text-14-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          AI 분석하기
        </button>
      </div>

      {error && (
        <div className="m-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

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
