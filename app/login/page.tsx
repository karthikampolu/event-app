"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering to prevent prerendering issues during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Main login component that provides a simple authentication system
// This is a client-side component because it handles user interactions and state
export default function LoginPage() {
  // State management for the form and UI
  const [userId, setUserId] = useState(""); // Stores the user ID input value
  const [loading, setLoading] = useState(false); // Tracks whether login is in progress
  const [error, setError] = useState(""); // Stores any error messages to display
  const [users, setUsers] = useState<any[]>([]); // Holds the list of available users from database
  const [isClient, setIsClient] = useState(false); // Prevents hydration errors by ensuring client-side rendering
  const [supabase, setSupabase] = useState<any>(null); // Holds the Supabase client instance

  // Effect hook that runs when component mounts
  // Prevents hydration mismatches and loads initial data
  useEffect(() => {
    setIsClient(true); // Mark as client-side rendered
    
    // Initialize Supabase client only on client-side to prevent build errors
    const supabaseClient = createClient(
      "https://zjwsyupnkawcmxmqsdue.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd3N5dXBua2F3Y214bXFzZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzQyNjksImV4cCI6MjA3MTExMDI2OX0.3cfG1e65kwv07D-c6V2aFP3gTIeiojvsta2n9ij3P6I"
    );
    setSupabase(supabaseClient);
    
    // Load users only after Supabase client is initialized
    loadAllUsers(supabaseClient);
  }, []);

  // Fetches all users from the database to display available options
  // This helps users know which IDs they can use to log in
  async function loadAllUsers(supabaseClient: any) {
    if (!supabaseClient) return;
    
    try {
      const { data, error } = await supabaseClient
        .from("users") // Query the users table
        .select("id, name, email") // Only fetch necessary fields
        .order("id"); // Sort by ID for consistent display
      
      if (error) {
        console.error("Error loading users:", error);
        setError("Could not load users from database");
      } else {
        setUsers(data || []); // Update state with user list (empty array fallback)
        console.log("Available users:", data);
      }
    } catch (err: any) {
      console.error("Database connection error:", err);
      setError("Database connection failed");
    }
  }

  // Handles the login form submission
  // Validates input, checks database, and redirects on success
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (!supabase) {
      setError("System not ready, please wait...");
      return;
    }
    
    setLoading(true); // Show loading state
    setError(""); // Clear any previous errors

    const userIdNum = parseInt(userId); // Convert input to number
    
    // Basic validation - ensure valid numeric ID
    if (!userIdNum || userIdNum < 1) {
      setError("Please enter a valid user ID");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with ID:", userIdNum);
      
      // Query database to find user with matching ID
      const { data: user, error } = await supabase
        .from("users")
        .select("id, name, email") // Fetch user details
        .eq("id", userIdNum) // Filter by ID
        .single(); // Expect single result

      console.log("Query result - Data:", user, "Error:", error);

      // Handle database errors
      if (error) {
        console.error("Supabase error:", error);
        setError(`Database error: ${error.message}`);
        setLoading(false);
        return;
      }

      // Handle case where user doesn't exist
      if (!user) {
        setError(`User ID ${userIdNum} not found. Available IDs: ${users.map(u => u.id).join(', ')}`);
        setLoading(false);
        return;
      }

      // Success path - store user data in browser storage and redirect
      localStorage.setItem("currentUser", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      }));

      console.log("Login successful for user:", user.name);
      window.location.href = "/"; // Redirect to home page

    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed: " + err.message);
    }

    setLoading(false); // Reset loading state
  }

  // Loading state component - prevents hydration errors
  // Shows while component initializes on client side
  if (!isClient || !supabase) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "4px solid #374151",
            borderTop: "4px solid #60a5fa",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p>Loading Event Manager...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Main login page UI
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
        
        {/* Available Users Display - Shows users that can be selected for login */}
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
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Responsive grid layout
            gap: "10px",
            fontSize: "14px",
            color: "#d1d5db"
          }}>
            {/* Map through users array to display each user option */}
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
          {/* Show loading message if users haven't loaded yet */}
          {users.length === 0 && (
            <p style={{ color: "#f59e0b", margin: 0 }}>Loading users...</p>
          )}
        </div>

        {/* Login Form - Main authentication interface */}
        <div style={{
          background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)", // Gradient background
          padding: "40px",
          borderRadius: "16px",
          border: "1px solid rgba(156, 163, 175, 0.2)",
          position: "relative"
        }}>
          {/* Decorative top border with gradient */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #667eea, #764ba2)"
          }}></div>

          {/* Page title and description */}
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

          {/* Error message display - shows when login fails */}
          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.2)", // Semi-transparent red background
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

          {/* Login form - captures user input and handles submission */}
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
              {/* Number input for user ID with validation constraints */}
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)} // Update state on input change
                placeholder="Enter user ID (e.g. 1, 2, 3...)"
                required
                min="1" // Prevent negative numbers
                max="10" // Set reasonable upper limit
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

            {/* Submit button with loading state handling */}
            <button
              type="submit"
              disabled={loading} // Disable during login process
              suppressHydrationWarning={true}
              style={{
                width: "100%",
                padding: "16px",
                background: loading ? "#6b7280" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Different colors for states
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer", // Change cursor based on state
                transition: "all 0.2s ease"
              }}
            >
              {/* Dynamic button text based on loading state */}
              {loading ? "Logging in..." : "Enter System"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
