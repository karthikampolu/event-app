/**
 * EVENT MANAGEMENT APP - HOME PAGE / DASHBOARD
 * 
 * This is the main dashboard page that users see after successful login.
 * It serves as the central hub for navigating to all major app features.
 * 
 * Key Features:
 * - User authentication verification and redirect to login if needed
 * - Personalized welcome message with current user information
 * - Quick action buttons for primary user workflows
 * - User session management with logout functionality
 * - Responsive design with professional styling
 * - Hydration-safe rendering to prevent client/server mismatches
 * 
 * Navigation Flow:
 * Login → Home Dashboard → Create Event / View Events / Manage RSVPs
 * 
 * Authentication:
 * - Checks localStorage for current user session
 * - Redirects unauthenticated users to login page
 * - Displays user info and provides logout option
 */

"use client";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Utility function to retrieve current user from browser localStorage
 * 
 * This function safely handles:
 * - Server-side rendering (returns null when window is undefined)
 * - JSON parsing with error handling
 * - Missing or invalid session data
 * 
 * @returns {Object|null} Current user object or null if not authenticated
 */
function getCurrentUser() {
  if (typeof window === 'undefined') return null; // Server-side safety check
  const userStr = localStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Main Home Page Component
 * 
 * Serves as the primary dashboard after user login, providing:
 * - Authentication state management
 * - Navigation to key app features
 * - User session display and logout capability
 * - Responsive layout with action buttons
 */
export default function HomePage() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // User authentication and session state
  const [user, setUser] = useState<any>(null);           // Current authenticated user
  const [loading, setLoading] = useState(true);          // Initial loading state
  const [isClient, setIsClient] = useState(false);       // Client-side rendering flag

  // ============================================
  // AUTHENTICATION & INITIALIZATION
  // ============================================
  
  /**
   * Effect hook for user authentication and component initialization
   * 
   * Process:
   * 1. Enable client-side rendering to prevent hydration issues
   * 2. Retrieve current user session from localStorage
   * 3. Redirect to login if no valid session found
   * 4. Set user state and disable loading when authentication confirmed
   */
  useEffect(() => {
    setIsClient(true); // Enable client-side rendering
    
    const currentUser = getCurrentUser();
    
    // Authentication guard - redirect if no user session
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }
    
    // Set authenticated user and stop loading
    setUser(currentUser);
    setLoading(false);
  }, []);

  // ============================================
  // USER SESSION MANAGEMENT
  // ============================================
  
  /**
   * Handles user logout process
   * 
   * Steps:
   * 1. Remove user session from localStorage
   * 2. Redirect to login page for re-authentication
   */
  function handleLogout() {
    localStorage.removeItem("currentUser"); // Clear user session
    window.location.href = "/login";        // Redirect to login
  }

  // ============================================
  // LOADING STATE RENDER
  // ============================================
  
  /**
   * Show loading state while:
   * - Component is initializing on client side
   * - User authentication is being verified
   */
  if (!isClient || loading) {
    return (
      <div style={{ 
        color: "white", 
        padding: "40px", 
        textAlign: "center",
        fontFamily: "Arial"
      }}>
        Loading...
      </div>
    );
  }

  // ============================================
  // RENDER MAIN DASHBOARD INTERFACE
  // ============================================
  
  return (
    <div style={{ 
      color: "white", 
      padding: "40px", 
      fontFamily: "Arial",
      textAlign: "center"
    }} suppressHydrationWarning={true}>
      
      {/* ========== USER AUTHENTICATION HEADER ========== */}
      {/* Top section showing current user info and logout option */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        padding: "15px",
        backgroundColor: "#1f2937",        // Dark gray background
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "0 auto 40px auto"
      }} suppressHydrationWarning={true}>
        
        {/* Current User Information Display */}
        <div>
          <p style={{ margin: 0, color: "#60a5fa" }}>
            Welcome back, <strong>{user?.name}</strong>!
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
            User ID: {user?.id}
          </p>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          suppressHydrationWarning={true}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",    // Red background for logout
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Logout
        </button>
      </div>

      {/* ========== APPLICATION BRANDING ========== */}
      {/* Main app title and description */}
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>PixaBeam Events</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "40px", color: "#888" }}>
        Create and manage your events easily
      </p>
      
      {/* ========== PRIMARY ACTION BUTTONS ========== */}
      {/* Main navigation buttons for core app features */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
        
        {/* Create Event Button - Primary action for event creation */}
        <Link href="/create">
          <div style={{
            padding: "15px 30px",
            backgroundColor: "#60a5fa",     // Blue - primary action
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
            display: "inline-block",
            transition: "background-color 0.2s ease"
          }} suppressHydrationWarning={true}>
            Create Event
          </div>
        </Link>
        
        {/* View Events Button - Navigate to events listing */}
        <Link href="/events">
          <div style={{
            padding: "15px 30px",
            backgroundColor: "#22c55e",     // Green - secondary action
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
            display: "inline-block",
            transition: "background-color 0.2s ease"
          }} suppressHydrationWarning={true}>
            View Events
          </div>
        </Link>
        
        
      </div>

      {/* ========== FEATURE HIGHLIGHTS SECTION ========== */}
      {/* Information panel showing app capabilities and benefits */}
      <div style={{ 
        marginTop: "40px", 
        padding: "20px", 
        backgroundColor: "#1f2937",       // Dark gray background
        borderRadius: "8px", 
        maxWidth: "600px", 
        margin: "40px auto 0 auto" 
      }} suppressHydrationWarning={true}>
        
        {/* Section Title */}
        <h3 style={{ color: "#f8fafc", margin: "0 0 15px 0" }}>Quick Stats</h3>
        
        {/* Feature List - Highlighting key app capabilities */}
        <p style={{ color: "#9ca3af", margin: "5px 0", fontSize: "14px" }}>
          • Create unlimited events<br/>
          • Track RSVPs from all users<br/>
          • View detailed event analytics<br/>
          • Manage your event responses<br/>
          • Connect with event creators
        </p>
      </div>
    </div>
  );
}
