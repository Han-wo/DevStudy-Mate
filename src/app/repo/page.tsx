import RepositoryExplorer from "@/components/repo/RepositoryExplorer";

export default function ReposPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-20-700 tracking-tight text-gray-900">
            DevMate
          </div>
          <p className="mt-8 text-14-600 text-gray-600">
            파일을 고르고 AI에게 분석을 맡기세요
          </p>
        </div>
        <div className="shadow overflow-hidden rounded-lg bg-white">
          <RepositoryExplorer />
        </div>
      </div>
    </div>
  );
}
