import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://zjwsyupnkawcmxmqsdue.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd3N5dXBua2F3Y214bXFzZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzQyNjksImV4cCI6MjA3MTExMDI2OX0.3cfG1e65kwv07D-c6V2aFP3gTIeiojvsta2n9ij3P6I"
);

type RSVPStatus = "Yes" | "No" | "Maybe";

// ✅ CHANGE THIS LINE - Add Promise<>
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ CHANGE THIS LINE - Await params
  const { id } = await params;
  const eventId = parseInt(id);

  // Get event details
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (!event) {
    return (
      <div style={{ color: "white", padding: "20px", textAlign: "center" }}>
        <h1>Event Not Found</h1>
        <p>Looking for event ID: {eventId}</p>
        <Link href="/events" style={{ color: "#60a5fa", textDecoration: "none" }}>
          ← Back to Events
        </Link>
      </div>
    );
  }

  // Get RSVPs with user information  
  const { data: rsvps } = await supabase
    .from("rsvps")
    .select(`
      status,
      updated_at,
      users (
        id,
        name
      )
    `)
    .eq("event_id", eventId);

  // Group RSVPs by status
  const rsvpCounts = { Yes: 0, No: 0, Maybe: 0 };
  const rsvpGroups: Record<RSVPStatus, any[]> = { Yes: [], No: [], Maybe: [] };

  rsvps?.forEach((rsvp) => {
    const status = rsvp.status as RSVPStatus;
    rsvpCounts[status]++;
    rsvpGroups[status].push(rsvp);
  });

  const totalAttending = rsvpCounts.Yes + rsvpCounts.Maybe;

  const getStatusColor = (status: RSVPStatus) => {
    switch (status) {
      case "Yes": return "#22c55e";
      case "Maybe": return "#f59e0b"; 
      case "No": return "#ef4444";
    }
  };

  const getStatusEmoji = (status: RSVPStatus) => {
    switch (status) {
      case "Yes": return "✅";
      case "Maybe": return "🤔";
      case "No": return "❌";
    }
  };

  const getStatusTitle = (status: RSVPStatus) => {
    switch (status) {
      case "Yes": return "Coming";
      case "Maybe": return "Maybe Coming";
      case "No": return "Not Coming";
    }
  };

  return (
    <div style={{ 
      color: "white", 
      padding: "20px", 
      fontFamily: "Arial, sans-serif", 
      maxWidth: "900px", 
      margin: "0 auto" 
    }}>
      {/* Back button */}
      <Link href="/events" style={{ 
        color: "#60a5fa", 
        textDecoration: "none", 
        marginBottom: "30px", 
        display: "inline-block",
        fontSize: "16px"
      }}>
        ← Back to Events
      </Link>

      {/* Event details */}
      <div style={{ 
        background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
        border: "1px solid rgba(156, 163, 175, 0.2)",
        padding: "30px", 
        borderRadius: "16px", 
        marginBottom: "30px",
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <h1 style={{ margin: "0", color: "#f8fafc", fontSize: "2.5rem" }}>{event.title}</h1>
          
          {/* Total Attending Badge */}
          <div style={{
            backgroundColor: totalAttending > 0 ? "#22c55e" : "#374151",
            color: "white",
            padding: "8px 16px", 
            borderRadius: "20px",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>👥</span>
            {totalAttending} attending
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontSize: "18px" }}>📅</span>
          <span style={{ color: "#a78bfa", fontSize: "18px", fontWeight: 500 }}>
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        {event.city && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <span style={{ fontSize: "16px" }}>📍</span>
            <span style={{ color: "#60a5fa", fontSize: "16px", fontWeight: 500 }}>{event.city}</span>
          </div>
        )}
        {event.description && (
          <p style={{ margin: "20px 0 0 0", lineHeight: "1.6", color: "#d1d5db", fontSize: "16px" }}>
            {event.description}
          </p>
        )}
      </div>

      {/* RSVP Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "20px",
        marginBottom: "40px"
      }}>
        {(["Yes", "Maybe", "No"] as RSVPStatus[]).map((status) => (
          <div key={status} style={{
            background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
            border: `2px solid ${getStatusColor(status)}`,
            padding: "24px",
            borderRadius: "12px", 
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>
              {getStatusEmoji(status)}
            </div>
            <div style={{ 
              fontSize: "36px", 
              fontWeight: "bold", 
              color: getStatusColor(status),
              marginBottom: "8px"
            }}>
              {rsvpCounts[status]}
            </div>
            <div style={{ color: "#d1d5db", fontSize: "16px", fontWeight: 600 }}>
              {getStatusTitle(status)}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed RSVP Lists */}
      <div style={{ display: "grid", gap: "30px" }}>
        {(["Yes", "Maybe", "No"] as RSVPStatus[]).map((status) => (
          <div key={status}>
            <h2 style={{ 
              color: getStatusColor(status), 
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "24px"
            }}>
              {getStatusEmoji(status)} 
              {getStatusTitle(status)} ({rsvpCounts[status]})
            </h2>
            
            {rsvpGroups[status].length > 0 ? (
              <div style={{ 
                background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                border: "1px solid rgba(156, 163, 175, 0.2)",
                borderRadius: "12px",
                overflow: "hidden"
              }}>
                {rsvpGroups[status].map((rsvp, index) => (
                  <div key={index} style={{
                    padding: "16px 20px",
                    borderBottom: index < rsvpGroups[status].length - 1 ? "1px solid rgba(156, 163, 175, 0.1)" : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "12px",
                        height: "12px", 
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(status)
                      }}></div>
                      <span style={{ fontSize: "16px", fontWeight: 500 }}>
                        {rsvp.users?.name || `User ${rsvp.users?.id}` || "Unknown User"}
                      </span>
                    </div>
                    <span style={{ color: "#9ca3af", fontSize: "14px" }}>
                      {new Date(rsvp.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                background: "#1f2937",
                border: "2px dashed #374151",
                borderRadius: "12px",
                padding: "30px",
                textAlign: "center"
              }}>
                <p style={{ color: "#9ca3af", fontStyle: "italic", margin: "0", fontSize: "16px" }}>
                  No one has selected this option yet.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
