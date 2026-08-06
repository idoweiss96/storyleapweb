import { secrets } from "base44:runtime";

export default async function (req: Request): Promise<Response> {
  try {
    const apiKey = secrets.get("POSTHOG_API_KEY");
    const host = secrets.get("POSTHOG_HOST");
    if (!apiKey || !host) {
      return Response.json({ api_key: null, host: null });
    }
    return Response.json({ api_key: apiKey, host });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}