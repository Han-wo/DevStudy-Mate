export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  language: string;
}

export interface RepoItem {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url?: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
}
