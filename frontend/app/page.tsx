"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser || "User");
        }
    }, []);

    const handleLogout = () => {
       
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <main className="w-full flex flex-col min-h-screen justify-center items-center bg-white text-black">
            <h1 className="text-4xl font-semibold mb-3">Welcome!</h1>
            {user ? (
                <div className="flex flex-col justify-center w-full items-center">
                    <p>Hello, {user}!</p>
                    <button
                        onClick={handleLogout}
                        className="button-50"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex flex-col justify-center w-full items-center space-y-3">
                    <Link href="/login" className="button-50">Login</Link> 
                    <Link href="/signup" className="button-50">Sign Up</Link>
                </div>
            )}
        </main>
    );
};

export default Home;
