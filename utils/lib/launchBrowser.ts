import puppeteer, { Browser } from "puppeteer";
import type { BrowserAuthConfig } from "./launchBrowser.interface";

export async function launchBrowserAuth(
  config: BrowserAuthConfig,
): Promise<string> {
  let browser: Browser;

  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
      channel: "chrome",
    });
  } catch (error) {
    console.log("Chrome tidak ditemukan. Beralih mencoba Microsoft Edge...");
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
      channel: "msedge" as any,
    });
  }

  const page = await browser.newPage();

  return new Promise<string>(async (resolve, reject) => {
    let isResolved = false;

    // Handle manual browser closure
    browser.on("disconnected", () => {
      if (!isResolved) {
        isResolved = true;
        reject(new Error("Browser was closed manually"));
      }
    });

    page.on("request", async (request) => {
      if (isResolved) return;

      const url = request.url();

      if (url.includes(config.targetUrlPattern)) {
        isResolved = true;

        try {
          const data = await config.extractData(page, request);

          console.log(config.successMessage);

          await browser.close();
          resolve(data);
        } catch (error) {
          await browser.close().catch(() => {});
          reject(error);
        }
      }
    });

    try {
      console.log(config.loadingMessage);
      await page.goto(config.url, {
        waitUntil: "networkidle2",
      });
    } catch (error) {
      if (!isResolved) {
        isResolved = true;
        await browser.close().catch(() => {});
        console.error("Navigation failed:", error);
        reject(error);
      }
    }
  });
}
