/*eslint-disable*/

import { NextRequest, NextResponse } from "next/server";

import { analyzeCode, CodeAnalysisResult } from "@/lib/openai";

// POST 메서드 핸들러
export async function POST(request: NextRequest) {
  try {
    const { fileName, fileContent } = await request.json();

    if (!fileName || !fileContent) {
      return NextResponse.json(
        { error: "파일 이름과 내용이 필요합니다." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API 키가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const analysis = await analyzeCode(apiKey, fileName, fileContent);
    return NextResponse.json({ analysis } as { analysis: CodeAnalysisResult });
  } catch (error) {
    console.error("분석 API 오류:", error);
    return NextResponse.json(
      { error: "파일 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
