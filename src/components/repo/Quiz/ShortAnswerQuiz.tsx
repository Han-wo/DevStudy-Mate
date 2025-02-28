import clsx from "clsx";

import { ShortAnswerQuiz } from "@/lib/openai";

interface ShortAnswerQuizProps {
  quiz: ShortAnswerQuiz;
  quizId: string;
  userAnswer: string;
  showResults: boolean;
  onAnswerChange: (quizId: string, answer: string) => void;
}

export default function ShortAnswerQuizComponent({
  quiz,
  quizId,
  userAnswer,
  showResults,
  onAnswerChange,
}: ShortAnswerQuizProps) {
  const isCorrect = () => {
    if (!showResults) return false;

    const normalizedUserAnswer = (userAnswer || "").trim().toLowerCase();
    const normalizedCorrectAnswer = quiz.answer.toLowerCase();

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      return true;
    }

    if (quiz.acceptableAnswers && quiz.acceptableAnswers.length > 0) {
      return quiz.acceptableAnswers
        .map((ans) => ans.toLowerCase())
        .includes(normalizedUserAnswer);
    }

    return false;
  };

  return (
    <div className="mt-10">
      <input
        type="text"
        className={clsx(
          "w-full rounded-md border p-3",
          !showResults &&
            "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
          showResults && {
            "border-green-500 bg-green-50": isCorrect(),
            "border-red-500 bg-red-50": !isCorrect(),
          },
        )}
        value={userAnswer || ""}
        onChange={(e) => onAnswerChange(quizId, e.target.value)}
        disabled={showResults}
        placeholder="답변을 입력하세요"
      />

      {showResults && (
        <div className="mt-2 rounded-md bg-blue-50 p-3">
          <p className="text-14-600 text-blue-700">정답: {quiz.answer}</p>
          {quiz.acceptableAnswers && quiz.acceptableAnswers.length > 0 && (
            <p className="mt-1 text-14-500 text-gray-700">
              허용 가능한 답변: {quiz.acceptableAnswers.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
