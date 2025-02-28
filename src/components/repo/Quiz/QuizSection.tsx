import clsx from "clsx";
import { useEffect, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";

import { CodeAnalysisResult } from "@/lib/openai";
import {
  isEssayQuiz,
  isMultipleChoiceQuiz,
  isShortAnswerQuiz,
} from "@/utils/quizTypeGard";

import EssayQuizComponent from "./EssayQuiz";
import MultipleChoiceQuizComponent from "./MutipleChoiceQuize";
import QuizExplanation from "./QuizExplain";
import ShortAnswerQuizComponent from "./ShortAnswerQuiz";

interface QuizSectionProps {
  analysis: CodeAnalysisResult;
}

export default function QuizSection({ analysis }: QuizSectionProps) {
  const [quizIds, setQuizIds] = useState<string[]>([]);
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<
    Map<string, number>
  >(new Map());
  const [shortAnswers, setShortAnswers] = useState<Map<string, string>>(
    new Map(),
  );
  const [essayAnswers, setEssayAnswers] = useState<Map<string, string>>(
    new Map(),
  );
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(0);

  // 퀴즈 재시작
  const resetQuiz = () => {
    setMultipleChoiceAnswers(new Map());
    setShortAnswers(new Map());
    setEssayAnswers(new Map());
    setShowResults(false);
    setScore(0);
  };

  // 퀴즈 ID 생성
  useEffect(() => {
    // 각 퀴즈에 대한 고유 ID 생성 - uuid 라이브러리 사용
    const ids = analysis.quizzes.map(() => uuidv4());
    setQuizIds(ids);
    resetQuiz();

    // 최대 가능 점수 계산 (객관식과 단답형만 포함)
    if (analysis.quizzes) {
      const scorableQuizzes = analysis.quizzes.filter(
        (quiz) => isMultipleChoiceQuiz(quiz) || isShortAnswerQuiz(quiz),
      ).length;
      setMaxScore(scorableQuizzes);
    }
  }, [analysis]);

  // 사용자 답변 업데이트 함수들
  const handleMultipleChoiceAnswer = (quizId: string, optionIndex: number) => {
    if (showResults) return;

    const newAnswers = new Map(multipleChoiceAnswers);
    newAnswers.set(quizId, optionIndex);
    setMultipleChoiceAnswers(newAnswers);
  };

  const handleShortAnswerChange = (quizId: string, value: string) => {
    if (showResults) return;

    const newAnswers = new Map(shortAnswers);
    newAnswers.set(quizId, value);
    setShortAnswers(newAnswers);
  };

  const handleEssayAnswerChange = (quizId: string, value: string) => {
    if (showResults) return;

    const newAnswers = new Map(essayAnswers);
    newAnswers.set(quizId, value);
    setEssayAnswers(newAnswers);
  };

  // 퀴즈 점수 계산
  const calculateScore = () => {
    let correctCount = 0;

    // 퀴즈별로 점수 계산
    analysis.quizzes.forEach((quiz, index) => {
      const quizId = quizIds[index];

      if (isMultipleChoiceQuiz(quiz)) {
        // 객관식 채점
        if (multipleChoiceAnswers.get(quizId) === quiz.answer) {
          correctCount += 1;
        }
      } else if (isShortAnswerQuiz(quiz)) {
        // 단답형 채점 (대소문자 구분 없이, 허용 가능한 답변 목록 확인)
        const userAnswer = (shortAnswers.get(quizId) || "")
          .trim()
          .toLowerCase();
        const correctAnswer = quiz.answer.toLowerCase();
        const acceptableAnswers = (quiz.acceptableAnswers || []).map((a) =>
          a.toLowerCase(),
        );

        if (
          userAnswer === correctAnswer ||
          acceptableAnswers.includes(userAnswer)
        ) {
          correctCount += 1;
        }
      }
      // 서술형(essay)은 자동 채점이 불가능하여 점수에 포함하지 않음
    });

    setScore(correctCount);
    setShowResults(true);
  };

  // 답변 상태 확인
  const isQuizAnswered = () => {
    let isAnswered = true;

    // 모든 퀴즈 타입 확인
    analysis.quizzes.forEach((quiz, index) => {
      const quizId = quizIds[index];

      if (isMultipleChoiceQuiz(quiz) && !multipleChoiceAnswers.has(quizId)) {
        isAnswered = false;
      } else if (
        isShortAnswerQuiz(quiz) &&
        (!shortAnswers.has(quizId) || !shortAnswers.get(quizId))
      ) {
        isAnswered = false;
      } else if (
        isEssayQuiz(quiz) &&
        (!essayAnswers.has(quizId) || !essayAnswers.get(quizId))
      ) {
        isAnswered = false;
      }
    });

    return isAnswered;
  };

  return (
    <div className="space-y-6">
      <div className="mt-10 flex items-center justify-between">
        <h3 className="text-20-700 text-gray-900">퀴즈</h3>

        {!showResults ? (
          <button
            type="button"
            onClick={calculateScore}
            disabled={!isQuizAnswered()}
            className={clsx(
              "rounded-md px-4 py-2 text-14-600 text-white",
              isQuizAnswered()
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-400",
            )}
          >
            채점하기
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-16-700 text-gray-900">
              {maxScore}문제 중 <span className="text-blue-600">{score}</span>
              문제 정답
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

      {quizIds.length > 0 &&
        analysis.quizzes.map((quiz, quizIndex) => {
          const quizId = quizIds[quizIndex];

          return (
            <div key={quizId} className="rounded-lg border border-gray-200 p-4">
              <p className="text-16-700 text-gray-900">
                {quizIndex + 1}. {quiz.question}
              </p>

              {/* 객관식 퀴즈 */}
              {isMultipleChoiceQuiz(quiz) && (
                <MultipleChoiceQuizComponent
                  quiz={quiz}
                  quizId={quizId}
                  selectedAnswer={multipleChoiceAnswers.get(quizId)}
                  showResults={showResults}
                  onAnswerSelect={handleMultipleChoiceAnswer}
                />
              )}

              {/* 단답형 퀴즈 */}
              {isShortAnswerQuiz(quiz) && (
                <ShortAnswerQuizComponent
                  quiz={quiz}
                  quizId={quizId}
                  userAnswer={shortAnswers.get(quizId) || ""}
                  showResults={showResults}
                  onAnswerChange={handleShortAnswerChange}
                />
              )}

              {/* 서술형 퀴즈 */}
              {isEssayQuiz(quiz) && (
                <EssayQuizComponent
                  quiz={quiz}
                  quizId={quizId}
                  userAnswer={essayAnswers.get(quizId) || ""}
                  showResults={showResults}
                  onAnswerChange={handleEssayAnswerChange}
                />
              )}

              {/* 설명 표시 (모든 퀴즈 유형 공통) */}
              <QuizExplanation
                explanation={quiz.explanation}
                showResults={showResults}
              />
            </div>
          );
        })}
    </div>
  );
}
