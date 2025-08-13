
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://qvxmnpulzqlsnlfbrhgm.supabase.co' 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eG1ucHVsenFsc25sZmJyaGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTgwMjcsImV4cCI6MjA3MDM5NDAyN30.g0IXy3bMpP4ZMKBclYANud-6VYdj7rpoCCm_OAMHJq8"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;