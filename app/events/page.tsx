import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Initialize Supabase client with project credentials
const supabase = createClient(
  "https://zjwsyupnkawcmxmqsdue.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd3N5dXBua2F3Y214bXFzZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzQyNjksImV4cCI6MjA3MTExMDI2OX0.3cfG1e65kwv07D-c6V2aFP3gTIeiojvsta2n9ij3P6I"
);

// Force dynamic rendering - no caching at all
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function EventsPage() {
  // Fetch all events from the database with cache-busting
  // We removed date filtering to ensure all events display properly
  // This prevents issues with timezone differences and date format mismatches
  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,date,city,description")
    .order("date", { ascending: true }); // Sort by date, earliest first

  return (
    <div style={{ color: "white", padding: "20px", fontFamily: "Arial" }}>
      <h1>All Events</h1>
      
      {/* Display current timestamp to verify no caching */}
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
        Last updated: {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
      </p>
      
      {/* Display error message if database query fails */}
      {error && (
        <p style={{ color: "red", padding: "10px", backgroundColor: "#330", borderRadius: "5px" }}>
          Error loading events: {error.message}
        </p>
      )}
      
      {/* Show total number of events found */}
      <p style={{ color: "#888", marginBottom: "20px" }}>
        {events?.length ? `Found ${events.length} events` : "No events found"}
      </p>

      {/* Render each event as a clickable card */}
      {events?.map(event => (
        <Link 
          key={event.id} 
          href={`/events/${event.id}`} 
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div style={{ 
            border: "1px solid #444", 
            margin: "10px 0", 
            padding: "15px", 
            borderRadius: "8px", 
            backgroundColor: "#1a1a1a",
            cursor: "pointer",
            transition: "background-color 0.2s ease" // Smooth hover effect
          }}>
            {/* Event title */}
            <h3 style={{ margin: "0 0 10px 0", color: "#60a5fa" }}>
              {event.title}
            </h3>
            
            {/* Event date */}
            <p style={{ margin: "5px 0", color: "#888" }}>
              📅 {event.date}
            </p>
            
            {/* Event city (only show if available) */}
            {event.city && (
              <p style={{ margin: "5px 0", color: "#888" }}>
                📍 {event.city}
              </p>
            )}
            
            {/* Event description (only show if available) */}
            {event.description && (
              <p style={{ margin: "10px 0 0 0", lineHeight: "1.5" }}>
                {event.description}
              </p>
            )}
            
            {/* Call-to-action text */}
            <div style={{ 
              marginTop: "10px", 
              fontSize: "14px", 
              color: "#60a5fa",
              fontWeight: "500"
            }}>
              Click to view RSVPs →
            </div>
          </div>
        </Link>
      ))}
      
      {/* Show message when no events exist in database */}
      {!events?.length && !error && (
        <div style={{ 
          textAlign: "center", 
          padding: "40px 20px", 
          color: "#666",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid #333"
        }}>
          <p>No events have been created yet.</p>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            Create your first event to get started!
          </p>
        </div>
      )}
    </div>
  );
}
