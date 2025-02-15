/* eslint-disable */

"use client";

import { useEffect, useState } from "react";

import useGitHubAuth from "@/hooks/use-auth";
import githubApi from "@/lib/github";

export default function RepoSelector() {
  const { token } = useGitHubAuth();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRepos() {
      if (!token) return;

      try {
        setLoading(true);
        const data = await githubApi.getUserRepos(token);
        setRepos(data);
      } catch (error) {
        console.error("레포지토리 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRepos();
  }, [token]);

  if (loading) {
    return <div>레포지토리 로딩중...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">레포지토리 선택택</h2>
      <select className="w-full rounded border p-2">
        <option value="">레포지토리 선택</option>
        {repos.map((repo: any) => (
          <option key={repo.id} value={repo.full_name}>
            {repo.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}
