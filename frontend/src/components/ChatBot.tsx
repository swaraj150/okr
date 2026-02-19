import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: string;
  content: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "AI", content: "Hello, how may I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "USER", content: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}chat-bot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chats: newMessages,
        })
      });

      // 🔥 Handle HTTP-level errors
      if (!response.ok) {
        throw new Error("Server error");
      }

      const text = await response.text();

      // 🔥 Try parsing JSON safely
      try {
        const parsed = JSON.parse(text);

        // If backend sent structured error
        if (parsed.statusCode && parsed.message) {
          setMessages(prev => [
            ...prev,
            { role: "AI", content: "⚠️ Something went wrong. Please try again." }
          ]);
          return;
        }

      } catch { }

      setMessages(prev => [
        ...prev,
        { role: "AI", content: text }
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "AI", content: "Something went wrong" }
      ]);
    } finally {
      setLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] rounded-xl shadow-md bg-white">

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] text-sm ${msg.role === "USER"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
                }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Generating...</div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about your OKRs..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
