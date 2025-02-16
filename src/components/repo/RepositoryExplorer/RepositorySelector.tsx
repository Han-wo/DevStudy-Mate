"use client";

import { useEffect, useState } from "react";

import useGitHubAuth from "@/hooks/use-auth";
import githubApi from "@/lib/github";
import { Repository } from "@/types/github";

interface Props {
  selectedRepo: string | null;
  onSelect: (repoFullName: string) => void;
}

export default function RepositorySelector({ selectedRepo, onSelect }: Props) {
  const { token } = useGitHubAuth();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      if (!token) return;
      try {
        const data = await githubApi.getUserRepos(token);
        setRepos(data);
      } catch (error) {
        console.error("레포에러:", error); //eslint-disable-line
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [token]);

  if (loading) {
    return (
      <div className="h-30 animate-pulse">
        <div className="size-full rounded-md bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor="repo-select" className="block text-16-700 text-gray-700">
        레포지토리 선택
      </label>
      <select
        id="repo-select"
        className="shadow-sm w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={selectedRepo || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">선택</option>
        {repos.map((repo) => (
          <option key={repo.id} value={repo.full_name}>
            {repo.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}
