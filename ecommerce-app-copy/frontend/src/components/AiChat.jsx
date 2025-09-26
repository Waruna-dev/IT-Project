import React, { useState } from "react";
import axios from "axios";
import Title from './Title.jsx';
import { backendUrl } from '../App.jsx';

const AiChat = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post(`${backendUrl}/api/ask`, { query });

      // ** FIX IS HERE **
      // Directly access the .text property from the simplified response
      setResponse(res.data.text || "No response.");

    } catch (error) {
      console.error("AI fetch error:", error);
      setResponse("Failed to fetch AI response. Please try again.");
    }

    setLoading(false);
};

  return (
    <div className="max-w-xl  mx-auto p-6 bg-gradient-to-br  bg-gray-100 shadow-xl rounded-2xl  transition-all duration-300 border-b-amber-700  border-1 ">
    <p className="text-center text-2xl font-medium text-gray-800 py-3">
      Ask From Chatbot
    </p>
    

    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="What's on your mind?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
  
      <button
        onClick={handleAsk}
        disabled={loading}
        className={`cursor-pointer w-full py-3 rounded-lg text-white font-semibold transition 
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`}
      >
        {loading ? "Thinking..." : "Ask Now"}
      </button>
    </div>
  
    {response && (
      <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-white shadow-sm animate-fade-in">
        <h4 className="font-bold text-blue-600 mb-2">Gemini AI says:</h4>
        <p className="text-gray-700 whitespace-pre-line">{response}</p>
      </div>
    )}
  </div>
  
  );
};

export default AiChat;
