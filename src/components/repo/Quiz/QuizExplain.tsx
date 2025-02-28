interface QuizExplanationProps {
  explanation: string;
  showResults: boolean;
}

export default function QuizExplanation({
  explanation,
  showResults,
}: QuizExplanationProps) {
  if (!showResults) return null;

  return (
    <div className="mt-3 rounded-md bg-blue-50 p-3">
      <p className="text-14-600 text-blue-700">설명:</p>
      <p className="text-14-500 text-gray-700">{explanation}</p>
    </div>
  );
}
