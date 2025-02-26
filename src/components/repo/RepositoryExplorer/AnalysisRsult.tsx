/*eslint-disable */

"use client";

import { useState } from "react";
import {
  LuBookOpen,
  LuDownload,
  LuPencilRuler,
  LuRefreshCw,
} from "react-icons/lu";

import { CodeAnalysisResult } from "@/lib/openai";

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

  // 퀴즈 관련 상태 관리
  const [userAnswers, setUserAnswers] = useState<number[]>(
    Array(analysis.quizzes.length).fill(-1),
  );
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // 사용자 답변 업데이트
  const handleAnswerSelect = (quizIndex: number, optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[quizIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  // 퀴즈 점수 계산
  const calculateScore = () => {
    let correctCount = 0;

    analysis.quizzes.forEach((quiz, index) => {
      if (userAnswers[index] === quiz.answer) {
        correctCount += 1;
      }
    });

    setScore(correctCount);
    setShowResults(true);
  };

  // 퀴즈 재시작
  const resetQuiz = () => {
    setUserAnswers(Array(analysis.quizzes.length).fill(-1));
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className={`flex items-center gap-2 rounded-md px-4 py-2 ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <LuBookOpen className="size-15" />
            <span>학습 노트</span>
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 rounded-md px-4 py-2 ${
              activeTab === "quiz"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("quiz");
              if (showResults) resetQuiz();
            }}
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

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "overview" ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-18-700 text-gray-900">
                {fileType === "code" ? "파일 개요" : "문서 개요"}
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-gray-700">
                {analysis.fileOverview}
              </p>
            </div>

            <div>
              <h3 className="text-18-700 text-gray-900">학습 포인트</h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {analysis.learningPoints.map((point) => (
                  <li
                    key={`point-${point.substring(0, 20)}`}
                    className="text-gray-700"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {fileType === "code" && analysis.techStack && (
              <div>
                <h3 className="text-18-700 text-gray-900">사용된 기술 스택</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.techStack.map((tech) => (
                    <span
                      key={`tech-${tech}`}
                      className="rounded-full bg-blue-100 px-3 py-1 text-14-500 text-blue-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {fileType === "markdown" && analysis.keyTerms && (
              <div>
                <h3 className="text-18-700 text-gray-900">주요 용어</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.keyTerms.map((term) => (
                    <span
                      key={`term-${term}`}
                      className="rounded-full bg-green-100 px-3 py-1 text-14-500 text-green-700"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {fileType === "code" && analysis.codeExplanation && (
              <div>
                <h3 className="text-18-700 text-gray-900">코드 설명</h3>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">
                  {analysis.codeExplanation}
                </p>
              </div>
            )}

            {fileType === "markdown" && analysis.sectionSummary && (
              <div>
                <h3 className="text-18-700 text-gray-900">주요 섹션 요약</h3>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">
                  {analysis.sectionSummary}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-20-700 text-gray-900">퀴즈</h3>

              {!showResults ? (
                <button
                  type="button"
                  onClick={calculateScore}
                  disabled={userAnswers.includes(-1)}
                  className={`rounded-md px-4 py-2 text-14-600 text-white ${
                    userAnswers.includes(-1)
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  채점하기
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-16-700 text-gray-900">
                    {analysis.quizzes.length}문제 중{" "}
                    <span className="text-blue-600">{score}</span>문제 정답
                  </div>
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-14-600 text-white hover:bg-blue-700"
                  >
                    <LuRefreshCw className="size-15" />
                    다시 풀기
                  </button>
                </div>
              )}
            </div>

            {analysis.quizzes.map((quiz, index) => (
              <div
                key={`quiz-${quiz.question.substring(0, 20)}`}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="text-16-700 text-gray-900">
                  {index + 1}. {quiz.question}
                </p>
                <div className="mt-3 space-y-2">
                  {quiz.options.map((option, optionIndex) => (
                    <div
                      key={`option-${quiz.question.substring(0, 10)}-${option.substring(0, 10)}`}
                      className={`rounded-md border p-3 ${
                        showResults
                          ? optionIndex === quiz.answer
                            ? "border-green-500 bg-green-50"
                            : userAnswers[index] === optionIndex
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200"
                          : userAnswers[index] === optionIndex
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                      }`}
                      onClick={() =>
                        !showResults && handleAnswerSelect(index, optionIndex)
                      }
                    >
                      <label className="flex w-full cursor-pointer items-start">
                        <input
                          type="radio"
                          name={`quiz-${index}`}
                          checked={userAnswers[index] === optionIndex}
                          onChange={() =>
                            !showResults &&
                            handleAnswerSelect(index, optionIndex)
                          }
                          disabled={showResults}
                          className={`mt-1 ${
                            showResults && optionIndex === quiz.answer
                              ? "accent-green-600"
                              : "accent-blue-600"
                          }`}
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    </div>
                  ))}
                </div>

                {showResults && (
                  <div className="mt-3 rounded-md bg-blue-50 p-3">
                    <p className="text-14-600 text-blue-700">설명:</p>
                    <p className="text-14-500 text-gray-700">
                      {quiz.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
