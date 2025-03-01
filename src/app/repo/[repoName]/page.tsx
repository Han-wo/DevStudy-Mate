"use client";

import { Suspense } from "react";
import { LuLoader } from "react-icons/lu";

import RepoHeader from "@/components/repo/RepoHeader";
import RepositoryExplorer from "@/components/repo/RepositoryExplorer";

interface RepoPageProps {
  params: {
    repoName: string;
  };
}
function LoadingState() {
  return (
    <div className="flex min-h-96 items-center justify-center">
      <LuLoader className="size-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">레포지토리를 불러오는 중...</span>
    </div>
  );
}

export default function RepoPage({ params }: RepoPageProps) {
  const repoFullName = decodeURIComponent(params.repoName);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RepoHeader repoFullName={repoFullName} />

        <div className="shadow mt-8 overflow-hidden rounded-lg bg-white">
          <Suspense fallback={<LoadingState />}>
            <RepositoryExplorer repoFullName={repoFullName} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
