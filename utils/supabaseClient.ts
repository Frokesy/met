import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ggtghwtizqslegihvjue.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndGdod3RpenFzbGVnaWh2anVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzgyMjMsImV4cCI6MjA3MTY1NDIyM30.6UgkD0YDFGyFs9LT_xvZCGAiXYljvDCzhXWoQpxWbyQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
