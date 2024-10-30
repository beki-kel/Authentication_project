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
            const response = await fetch("https://authentication-project-gamma.vercel.app/auth/register", {
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
            <div className="bg-white w-1/2 text-black flex flex-col py-3 rounded-3xl border-2 shadow-xl border-black">
                <h2 className="text-4xl py-8 font-bold text-center">Signup</h2>
                {error && <p className="text-center text-red-500 px-4 text-center">{error}</p>}
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
                        className="button-50" 
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                <p className="text-center my-4">
                    Already have an account?{" "}
                    <span 
                        onClick={() => router.push("/login")} 
                        className="text-blue-600 cursor-pointer underline"
                    >
                        Sign In
                    </span>
                </p>
            </div>    
        </div>
    );
};

export default Signup;
