// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oicfoioqjmhvsnjuerqv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pY2ZvaW9xam1odnNuanVlcnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDQxMTEsImV4cCI6MjA2Mjg4MDExMX0.LMsat9Z8wa60i14XjbMMImaPr7zL9ZC0Y2wuoJtdv6Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
