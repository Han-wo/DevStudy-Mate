import { NextRequest, NextResponse } from "next/server";

import { createNote, getUserNotes, StudyNote } from "@/lib/note";

// 노트 생성 API
export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Omit<
      StudyNote,
      "id" | "createdAt" | "updatedAt"
    >;

    if (!data.userId || !data.title || !data.fileName) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 },
      );
    }

    const noteId = await createNote(data);
    return NextResponse.json({ id: noteId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "노트 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// 노트 목록 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 },
      );
    }

    const notes = await getUserNotes(userId);
    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json(
      { error: "노트 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
