import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("session");

  // 보호된 라우트 체크
  if (request.nextUrl.pathname.startsWith("/(protected)")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 이미 로그인한 사용자가 auth 페이지 접근 시
  if (request.nextUrl.pathname.startsWith("/(auth)")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(protected)/:path*", "/(auth)/:path*"],
};
