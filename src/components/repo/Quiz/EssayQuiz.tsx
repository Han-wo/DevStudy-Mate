import clsx from "clsx";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { EssayQuiz } from "@/lib/openai";

interface EssayQuizProps {
  quiz: EssayQuiz;
  quizId: string;
  userAnswer: string;
  showResults: boolean;
  onAnswerChange: (quizId: string, answer: string) => void;
}

export default function EssayQuizComponent({
  quiz,
  quizId,
  userAnswer,
  showResults,
  onAnswerChange,
}: EssayQuizProps) {
  const [keyPointIds, setKeyPointIds] = useState<string[]>([]);

  useEffect(() => {
    if (quiz.keyPoints) {
      setKeyPointIds(quiz.keyPoints.map(() => uuidv4()));
    }
  }, [quiz.keyPoints]);

  return (
    <div className="mt-3">
      <textarea
        className={clsx(
          "min-h-24 w-full rounded-md border p-3",
          !showResults &&
            "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
          showResults && "border-gray-300 bg-gray-50",
        )}
        value={userAnswer || ""}
        onChange={(e) => onAnswerChange(quizId, e.target.value)}
        disabled={showResults}
        placeholder="서술형 답변을 작성하세요"
      />

      {showResults && (
        <div className="mt-2 rounded-md bg-blue-50 p-3">
          <p className="text-14-600 text-blue-700">모범 답안:</p>
          <p className="mt-1 rounded border border-blue-100 bg-white p-3 text-14-500 text-gray-700">
            {quiz.sampleAnswer}
          </p>

          {quiz.keyPoints && quiz.keyPoints.length > 0 && (
            <>
              <p className="mt-8 text-14-600 text-blue-700">평가 기준:</p>
              <ul className="mt-3 list-disc pl-20">
                {quiz.keyPoints.map((point, pointIndex) => {
                  const keyPointId = keyPointIds[pointIndex] || uuidv4();
                  return (
                    <li key={keyPointId} className="text-14-500 text-gray-700">
                      {point}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
