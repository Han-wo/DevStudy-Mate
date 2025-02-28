// 퀴즈 타입들
export type QuizType = "multipleChoice" | "shortAnswer" | "essay";

// 기본 퀴즈 인터페이스
export interface BaseQuiz {
  type: QuizType;
  question: string;
  explanation: string;
}

// 객관식 퀴즈
export interface MultipleChoiceQuiz extends BaseQuiz {
  type: "multipleChoice";
  options: string[];
  answer: number;
}

// 단답형 퀴즈
export interface ShortAnswerQuiz extends BaseQuiz {
  type: "shortAnswer";
  answer: string;
  acceptableAnswers?: string[];
}

// 서술형 퀴즈
export interface EssayQuiz extends BaseQuiz {
  type: "essay";
  sampleAnswer: string;
  keyPoints: string[];
}

// 통합 퀴즈 타입 (이전 형식 호환성 포함)
export type Quiz =
  | MultipleChoiceQuiz
  | ShortAnswerQuiz
  | EssayQuiz
  | {
      // 이전 형식 호환성을 위한 타입
      question: string;
      options: string[];
      answer: number;
      explanation: string;
    };

// 파일 타입별 분석 기능 제공
export interface CodeAnalysisResult {
  fileOverview: string;
  learningPoints: string[];
  techStack?: string[];
  keyTerms?: string[];
  codeExplanation?: string;
  sectionSummary?: string;
  quizzes: Quiz[];
}

/**
 * Express 서버 API를 호출하여 파일 분석
 */
export async function analyzeCode(
  apiKey: string,
  fileName: string,
  fileContent: string,
): Promise<CodeAnalysisResult> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName,
        fileContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `분석 API 오류: ${response.status} - ${errorData.error || "알 수 없는 오류"}`,
      );
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    throw new Error("파일 분석 중 오류가 발생했습니다.");
  }
}
