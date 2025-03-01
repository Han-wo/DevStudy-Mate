"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LuArrowLeft,
  LuBookOpen,
  LuChevronsUpDown,
  LuGithub,
  LuStar,
} from "react-icons/lu";

import useGitHubAuth from "@/hooks/use-auth";
import githubApi from "@/lib/github";
import { Repository } from "@/types/github";

interface RepoHeaderProps {
  repoFullName: string;
}

export default function RepoHeader({ repoFullName }: RepoHeaderProps) {
  const router = useRouter();
  const { token } = useGitHubAuth();
  const [repoData, setRepoData] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function fetchRepoDetails() {
      if (!token || !repoFullName) return;

      try {
        setLoading(true);
        const [owner, repo] = repoFullName.split("/");
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("레포지토리 정보를 가져오는데 실패했습니다");
        }

        const data = await response.json();
        setRepoData(data);

        const allRepos = await githubApi.getUserRepos(token);
        setRepositories(allRepos);
      } catch (error) {
        console.error("레포지토리 정보 가져오기 오류:", error); //eslint-disable-line
      } finally {
        setLoading(false);
      }
    }

    fetchRepoDetails();
  }, [repoFullName, token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowRepoSelector(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRepoChange = (newRepoFullName: string) => {
    if (newRepoFullName && newRepoFullName !== repoFullName) {
      router.push(`/repo/${encodeURIComponent(newRepoFullName)}`);
    }
    setShowRepoSelector(false);
  };

  return (
    <div>
      <div className="mb-10 flex items-center">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center text-16-500 text-blue-600 hover:text-blue-800"
        >
          <LuArrowLeft className="mr-1 size-25" />
          홈으로 돌아가기
        </button>
      </div>

      <div className="shadow-sm flex flex-col items-start justify-between gap-4 rounded-lg bg-white p-6 md:flex-row md:items-center">
        <div className="flex items-center">
          <LuGithub className="size-40" />

          <div className="ml-8">
            <div className="relative">
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setShowRepoSelector(!showRepoSelector)}
                className="flex items-center text-24-700 text-gray-900 hover:text-blue-600"
              >
                {repoFullName}
                <LuChevronsUpDown className="ml-5 size-15" />
              </button>

              {showRepoSelector && (
                <div
                  ref={dropdownRef}
                  className="shadow-lg absolute z-10 mt-1 max-h-106 w-full overflow-auto rounded-md border border-gray-200 bg-white"
                >
                  <div className="p-1">
                    {repositories.map((repo) => (
                      <button
                        type="button"
                        key={repo.id}
                        className={`w-full px-4 py-2 text-left text-14-500 hover:bg-gray-100 ${
                          repo.full_name === repoFullName
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-900"
                        }`}
                        onClick={() => handleRepoChange(repo.full_name)}
                      >
                        {repo.full_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-1 flex items-center text-14-500 text-gray-500">
              {!loading && repoData && (
                <>
                  <span className="flex items-center">
                    <LuStar className="mr-1 size-15" />
                    {repoData.stargazers_count} 스타
                  </span>
                  {repoData.language && (
                    <span className="ml-4 flex items-center">
                      {repoData.language}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-5 md:w-auto">
          <Link
            href={`https://github.com/${repoFullName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-md border border-gray-300 bg-white px-8 py-10 text-16-600 text-gray-700 hover:bg-gray-50"
          >
            <LuGithub className="mr-4 size-15" />
            GitHub에서 보기
          </Link>
          <button
            type="button"
            className="flex items-center rounded-md border border-gray-300 px-8 py-10 text-16-600 hover:bg-blue-100"
          >
            <LuBookOpen className="mr-4 size-15" />
            학습 노트 모아보기
          </button>
        </div>
      </div>
    </div>
  );
}
