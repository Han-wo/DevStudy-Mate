/*eslint-disable*/
"use client";

import { useEffect, useState } from "react";
import {
  LuBook,
  LuBrain,
  LuClipboardList,
  LuGithub,
  LuLoader,
} from "react-icons/lu";
import { useRouter } from "next/navigation";
import Image from "next/image";

import useGitHubAuth from "@/hooks/use-auth";
import githubApi from "@/lib/github";
import { getUserNotes } from "@/lib/note";
import { StudyNote } from "@/lib/note";
import { Repository } from "@/types/github";

export default function HomePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isInitialized } = useGitHubAuth();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [recentNotes, setRecentNotes] = useState<StudyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  useEffect(() => {
    // 인증 상태 확인 후 로그인 페이지로 리다이렉트
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  useEffect(() => {
    async function loadData() {
      if (!token || !user) return;

      try {
        setLoading(true);

        // 레포지토리 목록 가져오기
        const reposData = await githubApi.getUserRepos(token);
        setRepos(reposData);

        // 최근 학습 노트 가져오기
        const notes = await getUserNotes(user.id.toString());
        setRecentNotes(notes.slice(0, 3)); // 최근 3개만 표시
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token && user) {
      loadData();
    }
  }, [token, user]);

  const handleRepoSelect = () => {
    if (selectedRepo) {
      router.push(`/repo?repoName=${selectedRepo}`);
    }
  };

  // 로딩 중 표시
  if (!isInitialized || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <LuLoader className="mb-4 size-16 animate-spin text-blue-600" />
        <p className="text-16-600 text-gray-700">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 헤더 영역 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-32-700">DevStudy Mate</h1>
              <p className="mt-2 text-18-500 text-blue-100">
                AI를 활용한 개발자 학습 도우미
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                {user.avatar_url && (
                  <Image
                    src={user.avatar_url}
                    alt={user.name || user.login}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="text-16-700">{user.name || user.login}</p>
                  <p className="text-14-500 text-blue-100">@{user.login}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 레포지토리 선택 카드 */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-18-700 text-gray-900">
              <LuGithub className="size-15 text-blue-600" />
              학습할 레포지토리 선택
            </div>
            <p className="mb-4 text-gray-600">
              분석하고 싶은 GitHub 레포지토리를 선택하세요.
            </p>
            <div className="space-y-4">
              <select
                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
              >
                <option value="">레포지토리 선택</option>
                {repos.map((repo) => (
                  <option key={repo.id} value={repo.full_name}>
                    {repo.full_name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleRepoSelect}
                disabled={!selectedRepo}
                className={`w-full rounded-md py-2 text-center text-white ${
                  selectedRepo
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-400"
                }`}
              >
                레포지토리 탐색하기
              </button>
            </div>
          </div>

          {/* 학습 통계 카드 */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-18-700 text-gray-900">
              <LuBrain className="size-15 text-blue-600" />
              학습 통계
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span>작성한 학습 노트</span>
                <span className="font-semibold text-blue-600">
                  {recentNotes.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span>완료한 퀴즈</span>
                <span className="font-semibold text-blue-600">0</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span>분석한 파일 수</span>
                <span className="font-semibold text-blue-600">0</span>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/notes")}
                  className="w-full rounded-md bg-blue-100 py-2 text-center text-blue-700 hover:bg-blue-200"
                >
                  학습 노트 관리하기
                </button>
              </div>
            </div>
          </div>

          {/* 사용 가이드 카드 */}
          <div className="rounded-xl bg-white p-6 shadow-sm md:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2 text-18-700 text-gray-900">
              <LuBook className="size-15 text-blue-600" />
              사용 가이드
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-8 rounded-lg bg-blue-50 p-10">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full font-semibold text-blue-800">
                  1
                </div>
                <p className="text-gray-700">
                  <b>레포지토리 선택:</b> 분석하고 싶은 GitHub 레포지토리를
                  선택하세요.
                </p>
              </div>
              <div className="flex items-start gap-8 rounded-lg bg-blue-50 p-10">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-fullfont-semibold text-blue-800">
                  2
                </div>
                <p className="text-gray-700">
                  <b>파일 선택:</b> 레포지토리에서 학습하고 싶은 파일을
                  선택하세요.
                </p>
              </div>
              <div className="flex items-start gap-8 rounded-lg bg-blue-50 p-10">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full font-semibold text-blue-800">
                  3
                </div>
                <p className="text-gray-700">
                  <b>AI 분석:</b> AI가 코드를 분석하고 학습 노트와 퀴즈를
                  생성합니다.
                </p>
              </div>
              <div className="flex items-start gap-8 rounded-lg bg-blue-50 p-10">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full font-semibold text-blue-800">
                  4
                </div>
                <p className="text-gray-700">
                  <b>학습 및 복습:</b> 자동 생성된 퀴즈로 학습 내용을
                  복습하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 학습 노트 */}
        <div className="mt-10">
          <div className="mb-6 flex items-center gap-2 text-20-700 text-gray-900">
            <LuClipboardList className="size-6 text-blue-600" />
            최근 학습 노트
          </div>

          {recentNotes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  onClick={() => router.push(`/notes/${note.id}`)}
                >
                  <h3 className="text-16-700 text-gray-900">{note.title}</h3>
                  <p className="mt-1 text-14-500 text-gray-600 line-clamp-2">
                    {note.fileOverview}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-13-500 text-gray-500">
                      {note.fileName}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-12-600 text-blue-700">
                      {note.fileType === "code" ? "코드" : "문서"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <p className="text-16-500 text-gray-600">
                아직 작성된 학습 노트가 없습니다. 레포지토리에서 파일을 분석하여
                첫 학습 노트를 만들어보세요!
              </p>
              <button
                type="button"
                onClick={() =>
                  selectedRepo
                    ? router.push(`/repo?repoName=${selectedRepo}`)
                    : undefined
                }
                disabled={!selectedRepo}
                className={`mt-4 rounded-md px-4 py-2 text-14-600 text-white ${
                  selectedRepo ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
                }`}
              >
                {selectedRepo
                  ? "파일 분석하러 가기"
                  : "먼저 레포지토리를 선택하세요"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
