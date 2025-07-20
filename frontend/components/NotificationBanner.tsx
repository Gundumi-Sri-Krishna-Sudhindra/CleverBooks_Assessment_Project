'use client';

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect } from "react";

export default function NotificationBanner() {
  const { latest, clearLatest } = useNotification();

  useEffect(() => {
    if (latest) {
      const timer = setTimeout(() => clearLatest(), 4000);
      return () => clearTimeout(timer);
    }
  }, [latest, clearLatest]);

  if (!latest) return null;

  return (
    <div style={{
      position: "fixed",
      top: 20,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#222",
      color: "#fff",
      padding: "16px 32px",
      borderRadius: 8,
      zIndex: 9999,
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      fontSize: 16,
      minWidth: 280,
      textAlign: "center"
    }}>
      {latest.message}
    </div>
  );
} 