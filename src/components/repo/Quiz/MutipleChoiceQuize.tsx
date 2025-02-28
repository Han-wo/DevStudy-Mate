import clsx from "clsx";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { MultipleChoiceQuiz } from "@/lib/openai";

interface MultipleChoiceQuizProps {
  quiz: MultipleChoiceQuiz;
  quizId: string;
  selectedAnswer?: number;
  showResults: boolean;
  onAnswerSelect: (quizId: string, optionIndex: number) => void;
}

export default function MultipleChoiceQuizComponent({
  quiz,
  quizId,
  selectedAnswer,
  showResults,
  onAnswerSelect,
}: MultipleChoiceQuizProps) {
  const [optionIds, setOptionIds] = useState<string[]>([]);

  useEffect(() => {
    setOptionIds(quiz.options.map(() => uuidv4()));
  }, [quiz.options]);

  return (
    <div className="mt-3 space-y-2">
      {quiz.options.map((option, optionIndex) => {
        const optionId = optionIds[optionIndex] || uuidv4();

        return (
          <div
            key={optionId}
            className={clsx(
              "rounded-md border p-3",

              !showResults && {
                "border-blue-500 bg-blue-50": selectedAnswer === optionIndex,
                "border-gray-200 hover:border-blue-200 hover:bg-blue-50":
                  selectedAnswer !== optionIndex,
              },

              showResults && {
                "border-green-500 bg-green-50": optionIndex === quiz.answer,
                "border-red-500 bg-red-50":
                  selectedAnswer === optionIndex && optionIndex !== quiz.answer,
                "border-gray-200":
                  selectedAnswer !== optionIndex && optionIndex !== quiz.answer,
              },
            )}
            onClick={() => !showResults && onAnswerSelect(quizId, optionIndex)}
          >
            <label className="flex w-full cursor-pointer items-start">
              <input
                type="radio"
                name={`quiz-${quizId}`}
                checked={selectedAnswer === optionIndex}
                onChange={() =>
                  !showResults && onAnswerSelect(quizId, optionIndex)
                }
                disabled={showResults}
                className={clsx(
                  "mt-5",
                  showResults && optionIndex === quiz.answer
                    ? "accent-green-600"
                    : "accent-blue-600",
                )}
              />
              <span className="ml-2">{option}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
