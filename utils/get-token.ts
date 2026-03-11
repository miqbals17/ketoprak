import puppeteer from "puppeteer";

export async function getBearerToken(): Promise<string> {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  return new Promise(async (resolve, reject) => {
    page.on("request", async (request) => {
      const url = request.url();

      const targetApiUrl =
        "https://sipgn-api.bgn.go.id/api/v1/sipai-dashboard/sppg-connected?limit=1";

      if (url.includes(targetApiUrl)) {
        const headers = request.headers();

        const authHeader = headers["authorization"] || headers["Authorization"];

        if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
          console.log("✅ Gokil King! Bearer token berhasil ditangkap!");

          const token = authHeader.split(" ")[1];

          await browser.close();
          resolve(token);
        }
      }
    });

    try {
      console.log(
        "⏳ Membuka halaman login. Silakan login dan masukkan OTP...",
      );
      await page.goto("https://sipgn-sipai-dashboard.bgn.go.id", {
        waitUntil: "networkidle2",
      });
    } catch (error) {
      await browser.close();
      reject(error);
    }
  });
}
