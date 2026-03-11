import { launchBrowserAuth } from './lib/launchBrowser';

export async function getTokenSIPGN(): Promise<string> {
  return launchBrowserAuth({
    url: "https://sipgn-sipai-dashboard.bgn.go.id",
    targetUrlPattern: "https://sipgn-api.bgn.go.id/api/v1/sipai-dashboard/sppg-connected?limit=1",
    extractData: async (_page, request) => {
      const headers = request.headers();
      const authHeader = headers["authorization"] || headers["Authorization"];

      if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        return authHeader.split(" ")[1];
      }

      throw new Error("Authorization header not found");
    },
    loadingMessage: "⏳ Membuka halaman login. Silakan login dan masukkan OTP...",
    successMessage: "✅ Gokil King! Bearer token berhasil ditangkap!",
  });
}