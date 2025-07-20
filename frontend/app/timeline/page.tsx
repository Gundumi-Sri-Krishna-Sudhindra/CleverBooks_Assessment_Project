'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiService, Post } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // All hooks must be called before any return or conditional!
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await apiService.getTimeline();
        setPosts(response.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load timeline");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && !authLoading) fetchTimeline();
  }, [isAuthenticated, authLoading]);

  const refreshTimeline = async () => {
    setLoading(true);
    try {
      const response = await apiService.getTimeline();
      setPosts(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to refresh timeline");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Button asChild variant="secondary">
          <Link href="/home">Home</Link>
        </Button>
        <Button asChild>
          <Link href="/create-post">Create Post</Link>
        </Button>
        <Button onClick={refreshTimeline} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      
      {error && (
        <div style={{ padding: 12, background: "#fee", border: "1px solid #fcc", borderRadius: 4, color: "#c33", width: 400 }}>
          {error}
        </div>
      )}
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 400 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 20 }}>Loading timeline...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
            No posts in your timeline yet. Follow some users to see their posts!
          </div>
        ) : (
          posts.map(post => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <small style={{ color: "#666" }}>
                  By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </CardHeader>
              <CardContent>
                <p>{post.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
