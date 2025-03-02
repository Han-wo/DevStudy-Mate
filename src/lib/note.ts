import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/config";
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
  codeOptimizations?: CodeOptimizations; // 변경된 부분
  quizzes: Quiz[];
  createdAt?: string;
  updatedAt?: string;
}

const NOTES_COLLECTION = "studyNotes";

/**
 * 학습 노트 생성
 */
export async function createNote(note: StudyNote): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error("노트 생성 중 오류가 발생했습니다.");
  }
}

/**
 * 특정 사용자의 모든 학습 노트 조회
 */
export async function getUserNotes(userId: string): Promise<StudyNote[]> {
  try {
    const q = query(
      collection(db, NOTES_COLLECTION),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docs) => ({
      id: docs.id,
      ...docs.data(),
    })) as StudyNote[];
  } catch (error) {
    throw new Error("노트 목록을 가져오는 중 오류가 발생했습니다.");
  }
}

/**
 * 특정 학습 노트 조회
 */
export async function getNoteById(noteId: string): Promise<StudyNote | null> {
  try {
    const docRef = doc(db, NOTES_COLLECTION, noteId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as StudyNote;
    }
    return null;
  } catch (error) {
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
    const docRef = doc(db, NOTES_COLLECTION, noteId);
    await updateDoc(docRef, {
      ...noteData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error("노트 업데이트 중 오류가 발생했습니다.");
  }
}

/**
 * 학습 노트 삭제
 */
export async function deleteNote(noteId: string): Promise<void> {
  try {
    const docRef = doc(db, NOTES_COLLECTION, noteId);
    await deleteDoc(docRef);
  } catch (error) {
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
