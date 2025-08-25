"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Create Event Page Component - Allows users to create new events
// This is a client-side component because it handles form interactions and state
export default function CreateEventPage() {
  // Form state management - tracks all input field values
  const [title, setTitle] = useState(""); // Event title/name
  const [date, setDate] = useState(""); // Event date in YYYY-MM-DD format
  const [city, setCity] = useState(""); // Event location/city
  const [description, setDescription] = useState(""); // Optional event description
  const [loading, setLoading] = useState(false); // Tracks form submission state
  const [message, setMessage] = useState(""); // Success/error messages to display

  // Handles form submission and creates new event in database
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Show loading state while processing
    setMessage(""); // Clear any previous messages

    // Initialize Supabase client with project credentials
    // Note: In production, these should be environment variables
    const supabase = createClient(
      "https://zjwsyupnkawcmxmqsdue.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd3N5dXBua2F3Y214bXFzZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzQyNjksImV4cCI6MjA3MTExMDI2OX0.3cfG1e65kwv07D-c6V2aFP3gTIeiojvsta2n9ij3P6I"
    );

    try {
      // Insert new event into the database
      const { error } = await supabase.from("events").insert({
        title: title.trim(), // Remove whitespace from title
        date, // Event date (required field)
        city: city.trim() || null, // City - set to null if empty for proper database handling
        description: description.trim() || null, // Description - optional field
        created_by: 1  // Default creator ID - in real app, this would be the logged-in user
      });

      // Check if database operation failed
      if (error) throw error;

      // Success path - show success message and clear form
      setMessage("✅ Event created successfully!");
      setTitle("");
      setDate("");
      setCity("");
      setDescription("");

      // Redirect to events list page after 2 seconds
      // This gives user time to see the success message
      setTimeout(() => {
        window.location.href = "/events";
      }, 2000);

    } catch (error: any) {
      // Handle any errors that occurred during creation
      setMessage("❌ Error: " + error.message);
    }

    setLoading(false); // Reset loading state
  }

  // Render the create event form
  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", color: "white" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Create New Event</h1>
      
      {/* Success/Error Message Display */}
      {/* Shows feedback to user after form submission */}
      {message && (
        <div style={{ 
          padding: "15px", 
          marginBottom: "20px", 
          borderRadius: "8px",
          // Dynamic styling based on message type (success = green, error = red)
          backgroundColor: message.includes("✅") ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
          border: `1px solid ${message.includes("✅") ? "#22c55e" : "#ef4444"}`,
          textAlign: "center"
        }}>
          {message}
        </div>
      )}

      {/* Event Creation Form */}
      <form onSubmit={handleSubmit}>
        
        {/* Event Title Input - Required Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#d1d5db" }}>
            Event Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update state on input change
            required // HTML5 validation - field must be filled
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Event Date Input - Required Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#d1d5db" }}>
            Date *
          </label>
          <input
            type="date" // HTML5 date picker for better UX
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required // Must select a date
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Event City Input - Optional Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#d1d5db" }}>
            City *
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            // No 'required' attribute - this field is optional
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Event Description Input - Optional Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#d1d5db" }}>
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "16px",
              height: "100px", // Taller input for longer text
              resize: "vertical" // Allow user to resize vertically only
            }}
          />
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={loading} // Disable button during submission to prevent double-clicks
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: loading ? "#666" : "#60a5fa", // Gray when loading, blue when ready
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer" // Change cursor based on state
          }}
        >
          {/* Dynamic button text based on loading state */}
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {/* Navigation Link Back to Events List */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <a href="/events" style={{ color: "#60a5fa", textDecoration: "none" }}>
          ← Back to Events
        </a>
      </div>
    </div>
  );
}
