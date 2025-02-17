const BASE_URL = "https://api.github.com";

const githubApi = {
  async getUserRepos(token: string) {
    const response = await fetch(`${BASE_URL}/user/repos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }

    return response.json();
  },

  async getPRs(token: string, owner: string, repo: string) {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/pulls?state=all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch PRs");
    }

    return response.json();
  },

  async getPRFiles(
    token: string,
    owner: string,
    repo: string,
    prNumber: number,
  ) {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch PR files");
    }

    return response.json();
  },

  async getRepoContents(
    token: string,
    owner: string,
    repo: string,
    path: string = "",
  ) {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repository contents");
    }

    return response.json();
  },

  async getFileContent(
    token: string,
    owner: string,
    repo: string,
    path: string,
  ) {
    const url = `${BASE_URL}/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch file content");
    }

    return response.text();
  },
};

export default githubApi;
