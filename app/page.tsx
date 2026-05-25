"use client";


import { useState } from "react";
import "./styles.css";

export default function Playground() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(""); // Clear previous response

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.text);

    } catch (error) {
      setResponse("Failed to ftch response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-container">
      <h1 className="heading">AI Gateway Playground</h1>
      <form onSubmit={handleSubmit} className="form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your system prompt or message..."
          className="textarea"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="button"
        >
          {isLoading ? 'Routing Request...' : 'Send Request'}
        </button>
      </form>
      {response && (
        <div className="response-box">
          <h2 className="response-title">AI Response:</h2>
          <p className="response-text">{response}</p>
        </div>
      )}
    </main>
  );
}