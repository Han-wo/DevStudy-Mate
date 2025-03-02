import { useMemo } from "react";

import { CodeAnalysisResult } from "@/lib/openai";
import {
  generateIdsForItems,
  generateOptimizationIds,
} from "@/utils/uuidSetting";

interface OverviewSectionProps {
  analysis: CodeAnalysisResult;
  fileType: "markdown" | "code";
}

export default function OverviewSection({
  analysis,
  fileType,
}: OverviewSectionProps) {
  const pointIds = useMemo(
    () => generateIdsForItems(analysis.learningPoints),
    [analysis.learningPoints],
  );

  const techIds = useMemo(
    () => generateIdsForItems(analysis.techStack),
    [analysis.techStack],
  );

  const termIds = useMemo(
    () => generateIdsForItems(analysis.keyTerms),
    [analysis.keyTerms],
  );

  const optimizationIds = useMemo(
    () => generateOptimizationIds(analysis.codeOptimizations),
    [analysis.codeOptimizations],
  );

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

      {/* 코드 최적화 섹션 */}
      {fileType === "code" && analysis.codeOptimizations && (
        <div>
          <h3 className="text-18-700 text-gray-900">코드 최적화 제안</h3>

          {/* 성능 개선 */}
          {analysis.codeOptimizations.performanceImprovements?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-16-700 text-gray-800">성능 개선</h4>
              <ul className="mt-2 space-y-4">
                {analysis.codeOptimizations.performanceImprovements.map(
                  (item, index) => (
                    <li
                      key={optimizationIds.perf[index]}
                      className="rounded-lg border border-blue-100 bg-blue-50 p-4"
                    >
                      <div className="text-16-600 text-blue-800">
                        {item.issue}
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          위치:{" "}
                        </span>
                        <span className="text-14-500">{item.location}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          제안:{" "}
                        </span>
                        <span className="text-14-500">{item.suggestion}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          설명:{" "}
                        </span>
                        <span className="text-14-500">{item.explanation}</span>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {/* 가독성 개선 */}
          {analysis.codeOptimizations.readabilityImprovements?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-16-700 text-gray-800">가독성 개선</h4>
              <ul className="mt-2 space-y-4">
                {analysis.codeOptimizations.readabilityImprovements.map(
                  (item, index) => (
                    <li
                      key={optimizationIds.read[index]}
                      className="rounded-lg border border-green-100 bg-green-50 p-4"
                    >
                      <div className="text-16-600 text-green-800">
                        {item.issue}
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          위치:{" "}
                        </span>
                        <span className="text-14-500">{item.location}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          제안:{" "}
                        </span>
                        <span className="text-14-500">{item.suggestion}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          설명:{" "}
                        </span>
                        <span className="text-14-500">{item.explanation}</span>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {/* 유지보수성 개선 */}
          {analysis.codeOptimizations.maintainabilityImprovements?.length >
            0 && (
            <div className="mt-4">
              <h4 className="text-16-700 text-gray-800">유지보수성 개선</h4>
              <ul className="mt-2 space-y-4">
                {analysis.codeOptimizations.maintainabilityImprovements.map(
                  (item, index) => (
                    <li
                      key={optimizationIds.maint[index]}
                      className="rounded-lg border border-purple-100 bg-purple-50 p-4"
                    >
                      <div className="text-16-600 text-purple-800">
                        {item.issue}
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          위치:{" "}
                        </span>
                        <span className="text-14-500">{item.location}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          제안:{" "}
                        </span>
                        <span className="text-14-500">{item.suggestion}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-14-600 text-gray-700">
                          설명:{" "}
                        </span>
                        <span className="text-14-500">{item.explanation}</span>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {/* 모범 사례 */}
          {analysis.codeOptimizations.bestPractices?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-16-700 text-gray-800">모범 사례</h4>
              <ul className="mt-2 space-y-4">
                {analysis.codeOptimizations.bestPractices.map((item, index) => (
                  <li
                    key={optimizationIds.best[index]}
                    className="rounded-lg border border-yellow-100 bg-yellow-50 p-4"
                  >
                    <div className="text-16-600 text-yellow-800">
                      {item.issue}
                    </div>
                    <div className="mt-2">
                      <span className="text-14-600 text-gray-700">위치: </span>
                      <span className="text-14-500">{item.location}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-14-600 text-gray-700">제안: </span>
                      <span className="text-14-500">{item.suggestion}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-14-600 text-gray-700">설명: </span>
                      <span className="text-14-500">{item.explanation}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 잠재적 버그 */}
          {analysis.codeOptimizations.potentialBugs?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-16-700 text-gray-800">잠재적 버그</h4>
              <ul className="mt-2 space-y-4">
                {analysis.codeOptimizations.potentialBugs.map((item, index) => (
                  <li
                    key={optimizationIds.bug[index]}
                    className="rounded-lg border border-red-100 bg-red-50 p-4"
                  >
                    <div className="text-16-600 text-red-800">{item.issue}</div>
                    <div className="mt-2">
                      <span className="text-14-600 text-gray-700">위치: </span>
                      <span className="text-14-500">{item.location}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-14-600 text-gray-700">제안: </span>
                      <span className="text-14-500">{item.suggestion}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-14-600 text-gray-700">설명: </span>
                      <span className="text-14-500">{item.explanation}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
