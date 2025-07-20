'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      router.push("/login");
    }
  };

  return (
    <nav style={{ display: "flex", gap: 8, padding: 16, borderBottom: "1px solid #eee", background: "#fafafa" }}>
      {!isAuthenticated ? (
        <>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      ) : (
        <>
          <Button asChild variant="outline">
            <Link href="/home">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/timeline">Timeline</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/create-post">Create Post</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/users">Connect</Link>
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}
    </nav>
  );
} 