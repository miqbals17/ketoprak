import { Browser, Page } from "puppeteer";

export function connectJc(
  browser: Browser,
  mainTab: Page,
  jumpcloudCookie: string,
  jsonResponse: (data: any, status?: number) => string,
) {
  return new Promise(async (resolve) => {
    try {
      const jcTab = await browser.newPage();
      let isResolved = false;

      jcTab.on("request", async (request) => {
        if (isResolved) return;
        if (request.url().includes("/api/users/getSelf")) {
          isResolved = true;
          const rawCookies = await jcTab.cookies(
            "https://console.jumpcloud.com",
          );
          jumpcloudCookie = rawCookies
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");
          console.log("✅ Cookie Jumpcloud didapatkan!");

          await mainTab.bringToFront();
          resolve(jsonResponse({ success: true }));
        }
      });

      await jcTab.goto("https://console.jumpcloud.com/login");
    } catch (error) {
      resolve(jsonResponse({ success: false, error: String(error) }, 500));
    }
  });
}
