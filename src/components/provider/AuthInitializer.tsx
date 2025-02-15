"use client";

import { useEffect } from "react";

import useGitHubAuth from "@/hooks/use-auth";

export default function AuthInitializer() {
  const { initAuth } = useGitHubAuth();

  useEffect(() => {
    initAuth();
  }, []); //eslint-disable-line

  return null; // 아무것도 렌더링하지 않음
}
