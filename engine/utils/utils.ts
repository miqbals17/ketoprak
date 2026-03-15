import { CORS_HEADERS } from "./constants";

export function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export function log(message: string, level: "info" | "success" | "error") {
  const timestamp = new Date().toLocaleTimeString();

  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}
