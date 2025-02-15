"use client";

import { FaGithub } from "react-icons/fa";

export default function GitHubLoginButton() {
  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo`;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="flex h-70 w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
    >
      <FaGithub className="size-20" />
      Login with GitHub
    </button>
  );
}
