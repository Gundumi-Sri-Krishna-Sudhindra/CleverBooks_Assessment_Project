'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiService, User } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followed, setFollowed] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch users and following list from backend
  const fetchUsersAndFollowing = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiService.request<User[]>("/users");
      setUsers(res as User[]);
      // Fetch following list
      const followingRes = await apiService.getFollowing();
      setFollowed((followingRes.data || []).map((u) => u.id));
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) fetchUsersAndFollowing();
    // eslint-disable-next-line
  }, [isAuthenticated, authLoading]);

  const handleFollow = async (targetId: string) => {
    setFollowed((prev) => [...prev, targetId]); // Optimistically update
    try {
      await apiService.followUser(targetId);
      fetchUsersAndFollowing(); // Sync with backend
    } catch (err: any) {
      setFollowed((prev) => prev.filter((id) => id !== targetId)); // Revert on error
      alert(err.message || "Failed to follow user");
    }
  };

  const handleUnfollow = async (targetId: string) => {
    setFollowed((prev) => prev.filter((id) => id !== targetId)); // Optimistically update
    try {
      await apiService.unfollowUser(targetId);
      fetchUsersAndFollowing(); // Sync with backend
    } catch (err: any) {
      setFollowed((prev) => [...prev, targetId]); // Revert on error
      alert(err.message || "Failed to unfollow user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 40 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Find and Connect with Users</h1>
      <Input
        type="text"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 320, marginBottom: 24 }}
      />
      {error && <div style={{ color: "#c33", marginBottom: 16 }}>{error}</div>}
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <div style={{ width: 400, display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredUsers.length === 0 ? (
            <div style={{ color: "#666", textAlign: "center" }}>No users found.</div>
          ) : (
            filteredUsers.map((u) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, border: "1px solid #eee", borderRadius: 6, background: "#fafafa" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{u.name}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{u.email}</div>
                </div>
                {followed.includes(u.id) ? (
                  <Button variant="secondary" onClick={() => handleUnfollow(u.id)}>
                    Unfollow
                  </Button>
                ) : (
                  <Button onClick={() => handleFollow(u.id)}>
                    Follow
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 