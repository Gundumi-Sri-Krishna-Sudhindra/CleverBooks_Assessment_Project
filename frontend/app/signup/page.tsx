'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(email, password, name);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ minWidth: 320, padding: 32, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: "#fff", display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ textAlign: "center", marginBottom: 16 }}>Sign Up</h1>
        
        {error && (
          <div style={{ padding: 12, background: "#fee", border: "1px solid #fcc", borderRadius: 4, color: "#c33" }}>
            {error}
          </div>
        )}
        
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            type="text" 
            placeholder="Enter your name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <Button type="submit" style={{ marginTop: 16 }} disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
        
        <div style={{ textAlign: "center", marginTop: 16 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
} 