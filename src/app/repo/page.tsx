"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RepoRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoName = searchParams.get("repoName");

  useEffect(() => {
    if (repoName) {
      router.replace(`/repo/${encodeURIComponent(repoName)}`);
    } else {
      router.replace("/");
    }
  }, [repoName, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-500">레포지토리 이동중...</p>
    </div>
  );
}
