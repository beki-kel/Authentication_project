"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Signup failed");
            }

            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Signup;
