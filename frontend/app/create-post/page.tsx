'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiService.createPost(title, description);
      setSuccess("Post created successfully! It will be published in 5 seconds.");
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ minWidth: 320, padding: 32, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: "#fff", display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ textAlign: "center", marginBottom: 16 }}>Create a Post</h1>
        
        {error && (
          <div style={{ padding: 12, background: "#fee", border: "1px solid #fcc", borderRadius: 4, color: "#c33" }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ padding: 12, background: "#efe", border: "1px solid #cfc", borderRadius: 4, color: "#363" }}>
            {success}
          </div>
        )}
        
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            type="text" 
            placeholder="Post title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Label htmlFor="description">Description</Label>
          <Input 
            id="description" 
            type="text" 
            placeholder="What's on your mind?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
          />
        </div>
        <Button type="submit" style={{ marginTop: 16 }} disabled={loading}>
          {loading ? "Creating..." : "Submit"}
        </Button>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <Button asChild variant="secondary">
            <Link href="/home">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/timeline">Timeline</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
