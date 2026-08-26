import { createSessionToken, MAX_AGE_SECONDS, SESSION_COOKIE } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = String(body.username || "");
  const password = String(body.password || "");
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return Response.json({ error: "Invalid username or password." }, { status: 401 });
  }
  const token = await createSessionToken();
  const response = Response.json({ ok: true });
  response.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );
  return response;
}
