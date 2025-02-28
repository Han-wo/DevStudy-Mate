/*eslint-disable */

"use client";

import { useState } from "react";
import { LuBookOpen, LuDownload, LuPencilRuler } from "react-icons/lu";
import clsx from "clsx";

import { CodeAnalysisResult } from "@/lib/openai";
import OverviewSection from "../Analysis/OverViewSection";
import QuizSection from "../Quiz/QuizSection";

interface AnalysisResultProps {
  analysis: CodeAnalysisResult;
  fileType: "markdown" | "code";
  onClose: () => void;
  onSaveNote: (note: CodeAnalysisResult) => void;
}

export default function AnalysisResult({
  analysis,
  fileType,
  onClose,
  onSaveNote,
}: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "quiz">("overview");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className={clsx(
              "flex items-center gap-2 rounded-md px-4 py-2",
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700",
            )}
            onClick={() => setActiveTab("overview")}
          >
            <LuBookOpen className="size-15" />
            <span>학습 노트</span>
          </button>
          <button
            type="button"
            className={clsx(
              "flex items-center gap-2 rounded-md px-4 py-2",
              activeTab === "quiz"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700",
            )}
            onClick={() => setActiveTab("quiz")}
          >
            <LuPencilRuler className="size-15" />
            <span>퀴즈</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSaveNote(analysis)}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-14-600 text-white"
          >
            <LuDownload className="size-15" />
            노트 저장
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-14-600 text-gray-700"
          >
            닫기
          </button>
        </div>
      </div>

      {/* 내용 영역 */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "overview" ? (
          <OverviewSection analysis={analysis} fileType={fileType} />
        ) : (
          <QuizSection analysis={analysis} />
        )}
      </div>
    </div>
  );
}
