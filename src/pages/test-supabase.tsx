import { useEffect, useState } from "react";
import supabase from "../lib/supabase"; // adjust if your file is elsewhere

export default function TestSupabase() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Simple test that doesn't require a table
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        setStatus(`✅ Supabase connected! Session: ${session ? "Active" : "No active session"}`);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setStatus(`❌ Connection failed: ${err.message}`);
        } else {
          setStatus("❌ Connection failed: Unknown error");
        }
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Supabase Connection Test</h1>
      <p>{status}</p>
    </div>
  );
}
