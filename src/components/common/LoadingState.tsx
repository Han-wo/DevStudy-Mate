import { useEffect, useState } from "react";

interface LoadingProgressProps {
  stage: string | null;
  isLoading: boolean;
}

export default function LoadingProgress({
  stage,
  isLoading,
}: LoadingProgressProps) {
  const [progress, setProgress] = useState(0);

  // 단계별 진행 상태 매핑
  const stageProgress = {
    준비: 10,
    "파일 처리": 30,
    "AI 모델 호출": 60,
    "결과 처리": 90,
  };

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return undefined;
    }

    const targetProgress = stage
      ? stageProgress[stage as keyof typeof stageProgress]
      : 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [stage, isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="shadow-lg h-120 w-300 rounded-lg bg-white py-20">
        <h3 className="mb-3 text-center text-18-700 text-gray-900">
          AI 분석 진행 중
        </h3>

        <div className="mb-3 text-center text-gray-600">
          {stage ? `${stage} 중...` : "처리 중..."}
        </div>

        <div className="mx-auto h-2 w-200 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-10 text-center text-14-500 text-gray-500">
          {progress}% 완료
        </p>
      </div>
    </div>
  );
}
