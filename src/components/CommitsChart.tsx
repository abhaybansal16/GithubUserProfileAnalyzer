import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { format, subDays } from "date-fns";

type Props = {
  username: string;
};

type CommitData = {
  date: string;
  commits: number;
};

const getLast30Days = (): string[] => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) =>
    format(subDays(today, 29 - i), "yyyy-MM-dd")
  );
};

const CommitsChart: React.FC<Props> = ({ username }) => {
  const [data, setData] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCommits = async () => {
      setLoading(true);
      const since = subDays(new Date(), 30).toISOString();
      const dateMap: Record<string, number> = {};
      getLast30Days().forEach((d) => (dateMap[d] = 0));

      try {
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`
        );
        const repos = await reposRes.json();
        const topRepos = repos.slice(0, 5);

        for (const repo of topRepos) {
          const commitsRes = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/commits?since=${since}&per_page=100`
          );
          const commits = await commitsRes.json();

          for (const commit of commits) {
            const author = commit.author?.login;
            if (author !== username) continue;

            const date = format(new Date(commit.commit.author.date), "yyyy-MM-dd");
            if (dateMap[date] !== undefined) {
              dateMap[date]++;
            }
          }
        }

        const result = Object.entries(dateMap).map(([date, commits]) => ({
          date,
          commits,
        }));

        setData(result);
      } catch (error) {
        console.error("Failed to fetch commit data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [username]);

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Daily Commits (Last 30 Days)
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} tickMargin={8} />
              <YAxis allowDecimals={false} fontSize={12} tickMargin={8} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CommitsChart;
