import GitHubLoginButton from "@/components/auth/LoginButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="mb-20 text-center">
          <div className="text-24-700">DevStudy Mate</div>
          <p className="mt-10 text-20-500">로그인하고 AI와 함께 공부해요</p>
        </div>

        <GitHubLoginButton />
      </div>
    </div>
  );
}
