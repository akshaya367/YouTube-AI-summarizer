'use client';

import { useState } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatBox({ videoId }: { videoId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoId,
                    question: userMessage.content,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.answer,
                },
            ]);
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `Error: ${err.message}`,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-gray-900 rounded-2xl border border-gray-800 mt-8 overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Bot className="text-blue-400" size={20} />
                    Ask AI Questions
                </h3>
                <p className="text-sm text-gray-400">Ask anything specifically about this video.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                        <Bot size={48} className="opacity-50 text-blue-400" />
                        <p>What would you like to know about this video?</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'
                                    }`}
                            >
                                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div
                                className={`max-w-[80%] rounded-2xl px-5 py-3 ${message.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-5 py-3 text-gray-400 flex items-center gap-3">
                            <Loader2 className="animate-spin" size={16} /> AI is thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        placeholder="Type your question..."
                        className="w-full bg-gray-800 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 disabled:opacity-50 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
