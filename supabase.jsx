import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://iwafpiddqcbmlatthyme.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3YWZwaWRkcWNibWxhdHRoeW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMzUyNTIsImV4cCI6MjAzMTgxMTI1Mn0.mRuZQyyo6TC-hytA3weEssed_ujYCgh6GEswR8g7mEY"

export const supabase = createClient(supabaseURL,supabaseAnonKey);