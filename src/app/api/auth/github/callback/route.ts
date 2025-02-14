/*eslint-disable */
import { NextRequest } from "next/server";

import { setCookie } from "@/utils/nextCookies";

export async function GET(request: NextRequest) {
  // GitHub에서 리다이렉트된 인증 코드 확인
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("No authorization code provided", { status: 400 });
  }

  try {
    // GitHub OAuth 토큰 교환
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("토큰유무", tokenData);
      return new Response("Failed to get access token", { status: 401 });
    }

    // 사용자 정보 가져오기
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error("유저정보보", userData);
      return new Response("Failed to get user data", { status: 401 });
    }

    // nextCookies 유틸리티를 사용하여 토큰과 사용자 정보 저장
    await Promise.all([
      setCookie("github_token", tokenData.access_token),
      setCookie(
        "github_user",
        JSON.stringify({
          id: userData.id,
          login: userData.login,
          name: userData.name,
          avatar_url: userData.avatar_url,
        }),
      ),
    ]);

    // 대시보드로 리다이렉트
    return Response.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("에러:", error);
    return new Response("Internal Server Error", {
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default GET;
