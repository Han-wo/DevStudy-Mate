// OpenAI API 서비스 모듈
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * 파일 확장자 추출 함수
 */
function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/**
 * 파일 타입 확인 함수
 */
function getFileType(fileName: string): "markdown" | "code" {
  const ext = getFileExtension(fileName);
  return ["md", "markdown", "txt"].includes(ext) ? "markdown" : "code";
}

/**
 * OpenAI API를 통해 파일을 분석하고 학습 노트를 생성하는 함수
 * @param apiKey OpenAI API 키
 * @param fileName 파일 이름
 * @param fileContent 파일 내용
 * @returns 학습 노트 객체
 */
export interface CodeAnalysisResult {
  fileOverview: string;
  learningPoints: string[];
  techStack?: string[];
  keyTerms?: string[];
  codeExplanation?: string;
  sectionSummary?: string;
  quizzes: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}

export async function analyzeCode(
  apiKey: string,
  fileName: string,
  fileContent: string,
): Promise<CodeAnalysisResult> {
  const fileType = getFileType(fileName);

  try {
    // 파일 타입에 따른 시스템 프롬프트 설정
    let systemPrompt = "";

    if (fileType === "code") {
      systemPrompt = `당신은 개발자 학습을 도와주는 AI 튜터입니다. 
      주어진 코드 파일을 분석하여 다음 항목을 포함한 학습 노트를 생성해주세요:
      
      1. 파일 개요: 이 파일의 목적과 주요 기능
      2. 주요 학습 포인트: 이 코드에서 배울 수 있는 중요 개념과 패턴(각 항목은 구체적이고 실용적이어야 함)
      3. 기술 스택: 사용된 주요 라이브러리, 프레임워크, 패턴
      4. 코드 설명: 주요 코드 블록에 대한 상세한 설명(핵심 함수와 로직 위주)
      5. 학습 퀴즈: 이 코드와 관련된 5개의 퀴즈 문제로, 각 문제는 4개의 보기와 정답 번호(0-3), 그리고 해설을 포함해야 함
      
      퀴즈는 다음과 같은 형식이어야 합니다:
      - 개념 이해 문제: 코드에 사용된 패턴이나 개념에 대한 이해를 묻는 문제
      - 코드 분석 문제: 특정 코드 블록이 무슨 일을 하는지 파악하는 문제
      - 디버깅 문제: 코드의 잠재적 버그나 개선점을 찾는 문제
      - 실제 구현 문제: 유사한 기능을 구현하는 방법에 대한 문제
      
      결과는 다음 JSON 형식으로 반환해주세요:
      {
        "fileOverview": "파일 개요 텍스트",
        "learningPoints": ["학습 포인트1", "학습 포인트2", ...],
        "techStack": ["기술1", "기술2", ...],
        "codeExplanation": "코드 설명 텍스트",
        "quizzes": [
          {
            "question": "문제 내용",
            "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
            "answer": 정답 인덱스(0-3),
            "explanation": "정답 설명"
          },
          ...
        ]
      }`;
    } else {
      systemPrompt = `당신은 개발자 학습을 도와주는 AI 튜터입니다. 
      주어진 마크다운/텍스트 파일을 분석하여 다음 항목을 포함한 학습 노트를 생성해주세요:
      
      1. 문서 개요: 이 문서의 주요 주제와 목적
      2. 핵심 개념: 문서에서 다루는 주요 개념과 아이디어(5-7개)
      3. 주요 섹션 요약: 문서의 주요 섹션 및 그 내용 요약
      4. 학습 포인트: 이 문서에서 배울 수 있는 중요한 점
      5. 관련 기술/용어: 문서에 언급된 주요 기술이나 용어
      6. 학습 퀴즈: 이 문서와 관련된 5개의 퀴즈 문제로, 각 문제는 4개의 보기와 정답 번호(0-3), 그리고 해설을 포함해야 함
      
      퀴즈는 다음과 같은 형식이어야 합니다:
      - 개념 이해 문제: 문서의 주요 개념에 대한 이해를 묻는 문제
      - 내용 파악 문제: 문서의 특정 내용에 대한 기억을 테스트하는 문제
      - 적용 문제: 배운 내용을 실제 상황에 적용하는 문제
      - 분석 문제: 문서 내용에 대한 분석적 사고를 요구하는 문제
      
      결과는 다음 JSON 형식으로 반환해주세요:
      {
        "fileOverview": "문서 개요 텍스트",
        "learningPoints": ["학습 포인트1", "학습 포인트2", ...],
        "keyTerms": ["용어1", "용어2", ...],
        "sectionSummary": "주요 섹션 요약 텍스트",
        "quizzes": [
          {
            "question": "문제 내용",
            "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
            "answer": 정답 인덱스(0-3),
            "explanation": "정답 설명"
          },
          ...
        ]
      }`;
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // 또는 사용 가능한 최신 모델
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `파일명: ${fileName}\n\n파일 내용:\n${fileContent}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    throw new Error("파일 분석 중 오류가 발생했습니다.");
  }
}

/**
 * 학습 노트를 기반으로 퀴즈를 자동 생성하는 함수
 * @param apiKey OpenAI API 키
 * @param noteContent 학습 노트 내용
 * @returns 퀴즈 객체 배열
 */
export interface QuizResult {
  questions: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}

export async function generateQuizzes(
  apiKey: string,
  noteContent: Record<string, unknown>,
): Promise<QuizResult> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `당신은 개발자 학습을 위한 퀴즈 생성 AI입니다. 
            주어진 학습 노트를 기반으로 5개의 퀴즈 문제를 생성해주세요.
            각 문제는 다음 형식의 JSON 객체로 반환해주세요:
            {
              "questions": [
                {
                  "question": "문제 내용",
                  "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
                  "answer": 정답 인덱스(0-3),
                  "explanation": "정답 설명"
                },
                ...
              ]
            }`,
          },
          {
            role: "user",
            content: `학습 노트 내용:\n${JSON.stringify(noteContent)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    throw new Error("퀴즈 생성 중 오류가 발생했습니다.");
  }
}

export default { analyzeCode, generateQuizzes };
