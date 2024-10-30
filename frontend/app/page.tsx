// frontend/app/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/user", {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.name);
                }
            } catch (error) {
                console.log("Not authenticated");
            }
        };

        checkUser();
    }, []);

    return (
        <main>
            <h1>Welcome to Our App</h1>
            {user ? (
                <div>
                    <p>Hello, {user}!</p>
                    <button onClick={async () => {
                        await fetch("http://localhost:5000/auth/logout", {
                            method: "POST",
                            credentials: "include",
                        });
                        setUser(null);
                    }}>
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <p>You are not logged in.</p>
                    <Link href="/login">Login</Link> | <Link href="/signup">Sign Up</Link>
                </div>
            )}
        </main>
    );
};

export default Home;
