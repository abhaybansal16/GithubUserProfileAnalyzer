import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
}

const RepoList: React.FC<{ username: string }> = ({ username }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Something went wrong");
          setRepos([]);
          return;
        }

        if (Array.isArray(data)) {
          setRepos(data);
          setError(null);
        } else {
          setError("Unexpected response");
        }
      } catch (err) {
        setError("Failed to fetch repositories");
      }
    };

    fetchRepos();
  }, [username]);

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <Card key={repo.id}>
            <CardContent className="p-4">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-600"
              >
                {repo.name}
              </a>
              <p className="text-sm text-muted-foreground">{repo.description}</p>
              <p className="text-sm">⭐ {repo.stargazers_count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RepoList;
