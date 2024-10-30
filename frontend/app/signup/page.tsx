"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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

            router.push(`/login?email=${encodeURIComponent(formData.email)}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen text-black flex flex-col justify-center items-center">
            <div className="bg-black w-1/2 text-white flex flex-col py-3 rounded-3xl border-4 shadow-xl border-slate-200">
                <h2 className="text-4xl py-8 font-bold text-center">Signup</h2>
                {error && <p style={{ color: "red" }} className="text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center text-center">
                    <input 
                        type="text" 
                        className="border-2 p-3 rounded-xl m-5 mb-2 text-black" 
                        name="name" 
                        placeholder="Name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="email" 
                        className="border-2 p-3 rounded-xl m-5 mb-2 text-black" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="password" 
                        className="border-2 p-3 rounded-xl m-5 mb-8 text-black" 
                        name="password" 
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                    <button 
                        type="submit" 
                        className="bg-slate-50 shadow-lg m-4 px-6 py-3 rounded-xl text-black" 
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            </div>    
        </div>
    );
};

export default Signup;
