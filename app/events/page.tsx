import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://zjwsyupnkawcmxmqsdue.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd3N5dXBua2F3Y214bXFzZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzQyNjksImV4cCI6MjA3MTExMDI2OX0.3cfG1e65kwv07D-c6V2aFP3gTIeiojvsta2n9ij3P6I"
);//The Supabase Credentitals are disclosed these are client side

export default async function EventsPage() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: events } = await supabase
    .from("events")
    .select("id,title,date,city,description")
    .gte("date", today)
    .order("date", { ascending: true });

  return (
    <div style={{ color: "white", padding: "20px", fontFamily: "Arial" }}>
      <h1>Upcoming Events</h1>
      {events?.map(e => (
        <Link key={e.id} href={`/events/${e.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ 
            border: "1px solid #444", 
            margin: "10px 0", 
            padding: "15px", 
            borderRadius: "8px", 
            backgroundColor: "#1a1a1a",
            cursor: "pointer"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#60a5fa" }}>{e.title}</h3>
            <p style={{ margin: "5px 0", color: "#888" }}>📅 {e.date}</p>
            {e.city && <p style={{ margin: "5px 0", color: "#888" }}>📍 {e.city}</p>}
            {e.description && <p style={{ margin: "10px 0 0 0" }}>{e.description}</p>}
            
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#60a5fa" }}>
              Click to view RSVPs →
            </div>
          </div>
        </Link>
      ))}
      {!events?.length && <p style={{ color: "#888" }}>No events found.</p>}
    </div>
  );
}
