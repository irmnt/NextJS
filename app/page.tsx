"use client";

import { useState } from 'react';

export default function Playground() {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('openai'); // Default to OpenAI
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We now send BOTH the text and the chosen provider
        body: JSON.stringify({ prompt, provider }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.text);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse("Failed to fetch response from Gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">AI API Gateway</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Model Selector Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-gray-700">Select Target Model:</label>
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-black bg-white w-48"
          >
            <option value="openai">OpenAI (GPT-4o-mini)</option>
            <option value="gemini">Google (Gemini 1.5 Flash)</option>
          </select>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-4 border border-gray-300 rounded-md h-32"
          required
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 self-start"
        >
          {isLoading ? 'Routing Request...' : 'Send Request'}
        </button>
      </form>

      {response && (
        <div className="mt-8 p-6 bg-gray-100 border border-gray-200 rounded-md text-black">
          <h2 className="text-sm font-bold text-gray-500 mb-2">
            Response from {provider === 'openai' ? 'OpenAI' : 'Gemini'}:
          </h2>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </main>
  );
}