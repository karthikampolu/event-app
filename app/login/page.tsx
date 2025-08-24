"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zjwsyupnkawcmxmqsdue.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd3N5dXBua2F3Y214bXFzZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzQyNjksImV4cCI6MjA3MTExMDI2OX0.3cfG1e65kwv07D-c6V2aFP3gTIeiojvsta2n9ij3P6I"
);

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadAllUsers();
  }, []);

  async function loadAllUsers() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email")
        .order("id");
      
      if (error) {
        console.error("Error loading users:", error);
        setError("Could not load users from database");
      } else {
        setUsers(data || []);
        console.log("Available users:", data);
      }
    } catch (err: any) {
      console.error("Database connection error:", err);
      setError("Database connection failed");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userIdNum = parseInt(userId);
    
    if (!userIdNum || userIdNum < 1) {
      setError("Please enter a valid user ID");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with ID:", userIdNum);
      
      const { data: user, error } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("id", userIdNum)
        .single();

      console.log("Query result - Data:", user, "Error:", error);

      if (error) {
        console.error("Supabase error:", error);
        setError(`Database error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (!user) {
        setError(`User ID ${userIdNum} not found. Available IDs: ${users.map(u => u.id).join(', ')}`);
        setLoading(false);
        return;
      }

      // Success - store user and redirect
      localStorage.setItem("currentUser", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      }));

      console.log("Login successful for user:", user.name);
      window.location.href = "/";

    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed: " + err.message);
    }

    setLoading(false);
  }

  if (!isClient) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }} suppressHydrationWarning={true}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        color: "white"
      }}>
        
        {/* Available Users Display */}
        <div style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #374151"
        }}>
          <h2 style={{ margin: "0 0 15px 0", color: "#22c55e" }}>Available Users:</h2>
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            fontSize: "14px",
            color: "#d1d5db"
          }}>
            {users.map(user => (
              <div key={user.id} style={{ 
                padding: "8px",
                backgroundColor: "#111827",
                borderRadius: "4px",
                border: "1px solid #374151"
              }}>
                <strong style={{ color: "#60a5fa" }}>ID {user.id}:</strong> {user.name}
              </div>
            ))}
          </div>
          {users.length === 0 && (
            <p style={{ color: "#f59e0b", margin: 0 }}>Loading users...</p>
          )}
        </div>

        {/* Login Form */}
        <div style={{
          background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
          padding: "40px",
          borderRadius: "16px",
          border: "1px solid rgba(156, 163, 175, 0.2)",
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #667eea, #764ba2)"
          }}></div>

          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{
              fontSize: "2.5rem",
              margin: "0 0 10px 0",
              color: "#f8fafc"
            }}>
              Event Manager
            </h1>
            <p style={{ color: "#9ca3af", margin: 0 }}>
              Choose a User ID from above to continue
            </p>
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid #ef4444",
              color: "#ef4444",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
              fontSize: "14px"
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#d1d5db",
                fontWeight: 500
              }}>
                User ID
              </label>
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID (e.g. 1, 2, 3...)"
                required
                min="1"
                max="10"
                suppressHydrationWarning={true}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  backgroundColor: "#1f2937",
                  color: "white",
                  fontSize: "16px",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning={true}
              style={{
                width: "100%",
                padding: "16px",
                background: loading ? "#6b7280" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {loading ? "Logging in..." : "Enter System"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
