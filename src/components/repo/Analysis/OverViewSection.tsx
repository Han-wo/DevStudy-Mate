import { v4 as uuidv4 } from "uuid";

import { CodeAnalysisResult } from "@/lib/openai";

interface OverviewSectionProps {
  analysis: CodeAnalysisResult;
  fileType: "markdown" | "code";
}

export default function OverviewSection({
  analysis,
  fileType,
}: OverviewSectionProps) {
  const pointIds = analysis.learningPoints.map(() => uuidv4());
  const techIds = analysis.techStack?.map(() => uuidv4()) || [];
  const termIds = analysis.keyTerms?.map(() => uuidv4()) || [];

  return (
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
          {analysis.learningPoints.map((point, index) => (
            <li key={pointIds[index]} className="text-gray-700">
              {point}
            </li>
          ))}
        </ul>
      </div>

      {fileType === "code" && analysis.techStack && (
        <div>
          <h3 className="text-18-700 text-gray-900">사용된 기술 스택</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.techStack.map((tech, index) => (
              <span
                key={techIds[index]}
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
            {analysis.keyTerms.map((term, index) => (
              <span
                key={termIds[index]}
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
  );
}
