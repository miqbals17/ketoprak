import puppeteer from "puppeteer";

export async function getJCCookies() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  return new Promise(async (resolve, reject) => {
    page.on("request", async (request) => {
      const url = request.url();

      if (url.includes("/api/users/getSelf")) {
        const rawCookies = await page.cookies("https://console.jumpcloud.com");

        const cookieString = rawCookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; ");

        await browser.close();

        resolve(cookieString);
      }
    });

    try {
      console.log("⏳ Silakan login...");
      await page.goto("https://console.jumpcloud.com/login/admin", {
        waitUntil: "networkidle2",
      });
    } catch (error) {
      await browser.close();
      reject(error);
    }
  });
}
