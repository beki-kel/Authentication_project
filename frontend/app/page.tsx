"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

const ChatPage: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Assume not logged in by default
    const [userName, setUserName] = useState<string | null>(null); // Store the user’s name if logged in
    const router = useRouter();

    // Fetch user information on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('https://authentication-project-seven.vercel.app:5000/auth/user', {
                    credentials: 'include', 
                });
                const data = await response.json();

                if (data.success && data.user) {
                    setIsLoggedIn(true);
                    setUserName(data.user.name); 
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    const handleSend = async () => {
        if (!isLoggedIn) {
            router.push('/login'); 
            return;
        }

        setPrompt('');
        if (!prompt.trim()) return;

        const userMessage: Message = { text: prompt, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await fetch('https://authentication-project-seven.vercel.app:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ prompt }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!data.success) {
                if (data.message === "Please log in") {
                    setIsLoggedIn(false);
                    router.push('/login');
                } else {
                    setError(data.message);
                }
                setLoading(false);
                return;
            }

            const processedContent = remark().use(html).processSync(data.result);
            const result = processedContent.toString().replace(/<[^>]+>/g, '');

            const aiMessage: Message = { text: result, sender: 'ai' };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending prompt:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

      const handleLogout = async () => {
        try {
            const response = await fetch('https://authentication-project-seven.vercel.app:5000/auth/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies to clear the refresh token
            });
    
            const data = await response.json();
    
            if (data.success) {
                setIsLoggedIn(false);
                setUserName(null);
            } else {
                console.error("Logout failed:", data.message);
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
  

    return (
        <main className="flex flex-col items-start justify-start min-h-screen bg-white text-black w-full">
            <div className="flex justify-between items-center p-4 w-full">
                <h1 className="text-4xl font-semibold">ChatGemini💎</h1>
                <div>
                    {isLoggedIn ? (
                        <>
                            <span className="mr-4 font-light text-xl"> Hi {userName} 🖐 </span>
                            <button onClick={handleLogout} className="button-50">
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => router.push('/login')} className="button-50">
                            Login
                        </button>
                    )}
                </div>
            </div>
            <div className="bg-slate-100 flex flex-col w-full mb-4 overflow-y-auto rounded-lg p-24 mr-0 h-[75vh]">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-8 p-4 rounded-xl ${message.sender === 'user' ? 'bg-black text-white self-end' : 'shadow-lg bg-white text-black self-start'}`}>
                        {message.text}
                    </div>
                ))}
                {loading && (
                    <div className="p-4 rounded-lg bg-slate-200 text-black self-start animate-pulse">
                        Loading...
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 rounded-lg bg-red-200 text-red-800 self-start">
                        {error}
                    </div>
                )}
            </div>
            <div className='w-full flex space-x-5 justify-center items-center'>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type your prompt here..."
                    className="p-2 border border-black rounded mb-4 mr-4 w-1/2"
                />
                <button 
                    onClick={handleSend} 
                    className="button-50 mb-4"
                >
                    Send
                </button>
            </div>
        </main>
    );
};

export default ChatPage;
