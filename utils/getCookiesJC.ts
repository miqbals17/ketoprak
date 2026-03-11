import { launchBrowserAuth } from './lib/launchBrowser';

export async function getCookiesJC(): Promise<string> {
  return launchBrowserAuth({
    url: "https://console.jumpcloud.com/login/admin",
    targetUrlPattern: "/api/users/getSelf",
    extractData: async (page) => {
      const rawCookies = await page.cookies("https://console.jumpcloud.com");
      return rawCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
    },
    loadingMessage: "⏳ Silakan login ke JumpCloud...",
    successMessage: "✅ Gokil King! Cookies berhasil ditangkap!",
  });
}