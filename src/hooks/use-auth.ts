/* eslint-disable no-console */

"use client";

import { create } from "zustand";

import { deleteCookie, getCookie, setCookie } from "@/utils/nextCookies";

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

interface GitHubAuthStore {
  token: string | null;
  user: GitHubUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isInitializing: boolean;
  setAuth: (token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  initAuth: () => Promise<void>;
}

const useGitHubAuth = create<GitHubAuthStore>((set, get) => {
  let initPromise: Promise<void> | null = null;

  const fetchUserInfo = async (token: string): Promise<GitHubUser> => {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return response.json();
  };

  return {
    token: null,
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    isInitializing: false,

    setAuth: async (token: string) => {
      try {
        const user = await fetchUserInfo(token);

        await Promise.all([
          setCookie("github_token", token),
          setCookie("github_user", JSON.stringify(user)),
        ]);

        set({
          token,
          user,
          isAuthenticated: true,
          isInitialized: true,
        });
      } catch (error) {
        console.error("Failed to set auth:", error);
        throw error;
      }
    },

    clearAuth: async () => {
      await Promise.all([
        deleteCookie("github_token"),
        deleteCookie("github_user"),
      ]);

      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    },

    initAuth: async () => {
      // 이미 초기화되었다면 early return
      if (get().isInitialized) {
        return Promise.resolve();
      }

      // 이미 초기화 중이라면 기존 Promise 반환
      if (initPromise) {
        return initPromise;
      }

      // 새로운 초기화 Promise 생성
      initPromise = (async () => {
        try {
          set({ isInitializing: true });

          const [token, userJson] = await Promise.all([
            getCookie("github_token"),
            getCookie("github_user"),
          ]);

          const user = userJson ? JSON.parse(userJson) : null;

          if (token && user) {
            try {
              await fetchUserInfo(token);
            } catch (error) {
              await get().clearAuth();
              return;
            }
          }

          set({
            token,
            user,
            isAuthenticated: !!token,
            isInitialized: true,
            isInitializing: false,
          });
        } catch (error) {
          console.error("Auth initialization failed:", error);
          set({
            isInitialized: true,
            isInitializing: false,
          });
        } finally {
          initPromise = null;
        }
      })();

      return initPromise;
    },
  };
});

export default useGitHubAuth;
