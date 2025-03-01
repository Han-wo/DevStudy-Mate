"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { LuBrain, LuCode, LuFileJson2 } from "react-icons/lu";

import LoadingProgress from "@/components/common/LoadingState";
import useGitHubAuth from "@/hooks/use-auth";
import { createNote } from "@/lib/note";
import { CodeAnalysisResult } from "@/lib/openai";
import { RepoItem } from "@/types/github";

import AnalysisResult from "./AnalysisRsult";

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
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);

  // 파일이 변경될 때마다 분석 결과 초기화
  useEffect(() => {
    setAnalysis(null);
    setError(null);
  }, [file.path]);

  // 파일 타입 확인 함수
  const getFileType = (fileName: string): "markdown" | "code" => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    return ["md", "markdown", "txt"].includes(extension) ? "markdown" : "code";
  };

  const fileType = getFileType(file.name);

  // 파일 아이콘 선택 함수
  const getFileIcon = () => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    if (["js", "jsx", "ts", "tsx"].includes(extension)) {
      return <LuCode className="ml-5 mr-10 size-25 text-yellow-500" />;
    }
    if (["html", "css", "scss"].includes(extension)) {
      return <LuFileJson2 className="ml-5 mr-10 size-25 text-blue-500" />;
    }
    if (["md", "txt"].includes(extension)) {
      return <LuFileJson2 className="ml-5 mr-10 size-25 text-green-500" />;
    }
    if (["json", "yaml", "yml", "toml"].includes(extension)) {
      return <LuFileJson2 className="ml-5 mr-10 size-25 text-purple-500" />;
    }

    return <LuFileJson2 className="ml-5 mr-10 size-25 text-gray-500" />;
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      setAnalysisStage("준비");

      setTimeout(() => setAnalysisStage("파일 처리"), 1000);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      setTimeout(() => setAnalysisStage("AI 모델 호출"), 2000);

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

      setAnalysisStage("결과 처리");

      if (!response.ok) {
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
      setAnalysisStage(null);
    }
  };

  const handleSaveNote = async (analysisData: CodeAnalysisResult) => {
    try {
      if (!user) {
        setError("로그인이 필요합니다.");
        return;
      }

      setLoading(true);
      setAnalysisStage("노트 저장 중");

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
      setAnalysisStage(null);
    }
  };

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
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          {getFileIcon()}
          <div className="ml-3">
            <h3 className="text-16-700 text-gray-900">{file.name}</h3>
            <p className="mt-1 text-12-500 text-gray-500">
              {fileType === "code" ? "코드 파일" : "문서 파일"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAnalyze}
          className="shadow-sm flex items-center rounded-md bg-blue-600 px-4 py-5 text-14-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <LuBrain className="mr-2 size-15" />
          AI 분석하기
        </button>
      </div>

      {error && (
        <div className="m-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="h-[calc(100vh-20rem)] overflow-y-auto p-4">
          <pre className={clsx("rounded-lg p-4 text-14-500", "bg-gray-50")}>
            <code className="whitespace-pre-wrap font-mono text-gray-800">
              {content}
            </code>
          </pre>
        </div>
      </div>

      {/* 로딩 진행 표시기 */}
      {loading && <LoadingProgress stage={analysisStage} isLoading />}
    </div>
  );
}
