import {
  EssayQuiz,
  MultipleChoiceQuiz,
  Quiz,
  ShortAnswerQuiz,
} from "@/lib/openai";

/**
 * 객관식 퀴즈인지 확인하는 타입 가드
 */
export function isMultipleChoiceQuiz(quiz: Quiz): quiz is MultipleChoiceQuiz {
  return "type" in quiz && quiz.type === "multipleChoice";
}

/**
 * 단답형 퀴즈인지 확인하는 타입 가드
 */
export function isShortAnswerQuiz(quiz: Quiz): quiz is ShortAnswerQuiz {
  return "type" in quiz && quiz.type === "shortAnswer";
}

/**
 * 서술형 퀴즈인지 확인하는 타입 가드
 */
export function isEssayQuiz(quiz: Quiz): quiz is EssayQuiz {
  return "type" in quiz && quiz.type === "essay";
}
