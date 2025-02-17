"use client";

import { useEffect, useState } from "react";

import useGitHubAuth from "@/hooks/use-auth";
import githubApi from "@/lib/github";
import { RepoItem } from "@/types/github";

import Breadcrumbs from "./Breadcrumbs";
import FileListItem from "./FileListItem";
import LoadingState from "./LoadingState";

interface Props {
  repoFullName: string;
  onFileSelect: (file: RepoItem, content: string) => void;
}

export default function FileExplorer({ repoFullName, onFileSelect }: Props) {
  const { token } = useGitHubAuth();
  const [contents, setContents] = useState<RepoItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchContents = async (path: string) => {
    if (!token || !repoFullName) return;

    try {
      setLoading(true);
      setErrorMessage(null);
      const [owner, repo] = repoFullName.split("/");
      const data = await githubApi.getRepoContents(token, owner, repo, path);
      const sortedData = data.sort((a: RepoItem, b: RepoItem) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === "dir" ? -1 : 1;
      });
      setContents(sortedData);
    } catch (err) {
      setErrorMessage("디렉토리를 찾는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents("");
    setBreadcrumbs([]);
  }, [repoFullName, token]);

  const handleFileClick = async (item: RepoItem) => {
    if (!token || !repoFullName) return;

    try {
      if (item.type === "dir") {
        setLoading(true);
        const newBreadcrumbs = [...breadcrumbs, item.name];
        setBreadcrumbs(newBreadcrumbs);
        await fetchContents(item.path);
      } else {
        setLoading(true);
        const [owner, repo] = repoFullName.split("/");
        const content = await githubApi.getFileContent(
          token,
          owner,
          repo,
          item.path,
        );
        onFileSelect(item, content);
      }
    } catch (err) {
      setErrorMessage(
        item.type === "dir"
          ? "디렉토리를 찾는데 실패했습니다"
          : "파일을 로드하는데 실패했습니다",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBreadcrumbClick = async (index: number) => {
    try {
      if (index === -1) {
        setBreadcrumbs([]);
        await fetchContents("");
        return;
      }

      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      const newPath = newBreadcrumbs.join("/");
      setBreadcrumbs(newBreadcrumbs);
      await fetchContents(newPath);
    } catch (err) {
      setErrorMessage("디렉토리를 찾는데 실패했습니다");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Breadcrumbs items={breadcrumbs} onNavigate={handleBreadcrumbClick} />

      {errorMessage && (
        <div className="border-b border-red-100 bg-red-50 p-4 text-red-500">
          {errorMessage}
        </div>
      )}

      {contents.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          This directory is empty
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {contents.map((item) => (
            <FileListItem
              key={item.path}
              item={item}
              onClick={handleFileClick}
              isLoading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
