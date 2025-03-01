// src/app/repo/page.tsx
import { redirect } from "next/navigation";

interface RepoPageProps {
  searchParams: {
    repoName?: string;
  };
}

export default function RepoPage({ searchParams }: RepoPageProps) {
  const { repoName } = searchParams;

  if (repoName) {
    redirect(`/repo/${encodeURIComponent(repoName)}`);
  } else {
    redirect("/");
  }
}
