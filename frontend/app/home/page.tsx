'use client';

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ minWidth: 320, padding: 32, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: "#fff", display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ textAlign: "center", marginBottom: 16 }}>Welcome, {user?.name}!</h1>
        
        <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 8px 0" }}>Your Profile</h3>
          <p style={{ margin: "4px 0" }}><strong>Email:</strong> {user?.email}</p>
          <p style={{ margin: "4px 0" }}><strong>Name:</strong> {user?.name}</p>
        </div>
        
        <Button asChild>
          <Link href="/timeline">Go to Timeline</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/create-post">Create a Post</Link>
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
