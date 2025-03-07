/* eslint-disable no-console */

import { CodeOptimizations, Quiz } from "@/lib/openai";

export interface StudyNote {
  id?: string;
  userId: string;
  title: string;
  fileName: string;
  repoName: string;
  fileType: "markdown" | "code";
  fileOverview: string;
  learningPoints: string[];
  techStack?: string[];
  keyTerms?: string[];
  codeExplanation?: string;
  sectionSummary?: string;
  codeOptimizations?: CodeOptimizations;
  quizzes: Quiz[];
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * 학습 노트 생성
 */
export async function createNote(note: StudyNote): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "노트 생성 중 오류가 발생했습니다.");
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("노트 생성 오류:", error);
    throw new Error("노트 생성 중 오류가 발생했습니다.");
  }
}

/**
 * 특정 사용자의 모든 학습 노트 조회
 */
export async function getUserNotes(userId: string): Promise<StudyNote[]> {
  try {
    const response = await fetch(`${API_URL}/api/note?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "노트 목록을 가져오는 중 오류가 발생했습니다.",
      );
    }

    const data = await response.json();
    return data.notes;
  } catch (error) {
    console.error("노트 목록 조회 오류:", error);
    throw new Error("노트 목록을 가져오는 중 오류가 발생했습니다.");
  }
}

/**
 * 특정 학습 노트 조회
 */
export async function getNoteById(
  noteId: string,
  userId: string,
): Promise<StudyNote | null> {
  try {
    // userId를 쿼리 파라미터로 추가
    const response = await fetch(
      `${API_URL}/api/note/${noteId}?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "노트를 가져오는 중 오류가 발생했습니다.",
      );
    }

    const data = await response.json();
    return data.note;
  } catch (error) {
    console.error("노트 조회 오류:", error);
    throw new Error("노트를 가져오는 중 오류가 발생했습니다.");
  }
}

/**
 * 학습 노트 업데이트
 */
export async function updateNote(
  noteId: string,
  noteData: Partial<StudyNote>,
): Promise<void> {
  try {
    // userId가 포함되어 있는지 확인
    if (!noteData.userId) {
      throw new Error("사용자 ID가 필요합니다.");
    }

    const response = await fetch(`${API_URL}/api/note/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "노트 업데이트 중 오류가 발생했습니다.",
      );
    }
  } catch (error) {
    console.error("노트 업데이트 오류:", error);
    throw new Error("노트 업데이트 중 오류가 발생했습니다.");
  }
}

/**
 * 학습 노트 삭제
 */
export async function deleteNote(
  noteId: string,
  userId: string,
): Promise<void> {
  try {
    // userId를 쿼리 파라미터로 추가
    const response = await fetch(
      `${API_URL}/api/note/${noteId}?userId=${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "노트 삭제 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("노트 삭제 오류:", error);
    throw new Error("노트 삭제 중 오류가 발생했습니다.");
  }
}

export default {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
