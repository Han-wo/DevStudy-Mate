"use client";

import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";

import useGitHubAuth from "@/hooks/use-auth";
import githubApi from "@/lib/github";
import { RepoItem } from "@/types/github";

import Breadcrumbs from "./Breadcrumbs";
import FileListItem from "./FileListItem";
import LoadingState from "./LoadingState";

interface FileExplorerProps {
  repoFullName: string;
  onFileSelect: (file: RepoItem, content: string) => void;
}

export default function FileExplorer({
  repoFullName,
  onFileSelect,
}: FileExplorerProps) {
  const { token } = useGitHubAuth();
  const [contents, setContents] = useState<RepoItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

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
        setSelectedFilePath(item.path);
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

  // 검색어에 따라 파일 필터링
  const filteredContents = contents.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="h-full">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LuSearch className="size-15 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-white py-5 pl-20 pr-3 text-14-500 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="파일 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Breadcrumbs items={breadcrumbs} onNavigate={handleBreadcrumbClick} />

      {errorMessage && (
        <div className="border-b border-red-100 bg-red-50 p-4 text-red-500">
          {errorMessage}
        </div>
      )}

      <div className="h-[calc(100vh-20rem)] overflow-y-auto">
        {filteredContents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm
              ? "검색 결과가 없습니다."
              : "이 디렉토리는 비어있습니다."}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredContents.map((item) => (
              <FileListItem
                key={item.path}
                item={item}
                onClick={handleFileClick}
                isLoading={loading}
                isSelected={item.path === selectedFilePath}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
