import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "../../../../lib/auth";

export async function GET() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const authenticated = await verifySessionToken(token);
  return Response.json({ authenticated });
}
