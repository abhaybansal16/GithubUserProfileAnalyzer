import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RepoList from "@/components/RepoList";
import CommitsChart from "@/components/CommitsChart";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState<string | null>(null);

  const handleSubmit = () => {
    if (username.trim()) {
      setSubmittedUsername(username.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">GitHub User Profile Analyzer</h1>

      <div className="flex gap-2 items-center justify-center">
        <Input
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={handleSubmit}>Analyze</Button>
      </div>

      {submittedUsername && (
        <>
          <RepoList username={submittedUsername} />
          <CommitsChart username={submittedUsername} />
        </>
      )}
    </div>
  );
};

export default App;
