/*
  Contact form — same Supabase edge function the original site invokes
  ("send-contact-message"), with the same consent metadata shape.
*/
const SUPABASE_URL = "https://bkrtldtwnrlduzjmwsgt.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcnRsZHR3bnJsZHV6am13c2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNjg0MDEsImV4cCI6MjA3NDg0NDQwMX0.GCmjkeDspkteZWnUoAuPUW2cvytcl4wiSJGTFeuaiMg";

export async function sendContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  agreedToTerms: boolean;
}) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-message`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
      consent_timestamp: new Date().toISOString(),
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.error) throw new Error(body?.error || "send_failed");
  return body;
}
