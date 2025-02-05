import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://dcsajvbrqxygbeigkurn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjc2FqdmJycXh5Z2JlaWdrdXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMjQ0OTgsImV4cCI6MjA0MzcwMDQ5OH0.A0DlcEAPM94WOzL7uj_fcMdoJqWqLkDEWBhQpQ_wlW4"

export const supabase = createClient(supabaseURL,supabaseAnonKey);
