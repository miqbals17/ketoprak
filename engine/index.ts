import puppeteer, { Browser, Page } from "puppeteer";
import { jsonResponse, log } from "./utils/utils";
import { CORS_HEADERS } from "./utils/constants";
import { checkPemantauanCctv, checkStatusJc } from "./services/services";

// Variabel Global
let browser: Browser;
let mainTab: Page;
let jumpcloudCookie: string | null = null;
let sipgnBearerToken: string | null = null;

// =====================================================================
// SERVER BACKEND (API ROUTING)
// =====================================================================
Bun.serve({
  port: 4000,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight
    if (req.method === "OPTIONS")
      return new Response(null, { headers: CORS_HEADERS });

    // -----------------------------------------------------------------
    // ENDPOINT: STATUS CHECK (Untuk Polling dari Frontend)
    // -----------------------------------------------------------------
    if (url.pathname === "/api/status-jc" && req.method === "GET") {
      log("Check Jumpcloud Cookie...", "info");
      return jsonResponse({ isConnected: jumpcloudCookie !== null });
    }

    if (url.pathname === "/api/status-sipgn" && req.method === "GET") {
      log("Check SIPGN Bearer Token...", "info");
      return jsonResponse({ isConnected: sipgnBearerToken !== null });
    }

    // -----------------------------------------------------------------
    // ENDPOINT: CONNECT JUMPCLOUD
    // -----------------------------------------------------------------
    if (url.pathname === "/api/connect-jc" && req.method === "GET") {
      log("Connecting Jumpcloud...", "info");

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
              log("Successfully getting Cookie Jumpcloud!", "success");

              await mainTab.bringToFront();
              resolve(jsonResponse({ success: true }));
            }
          });

          await jcTab.goto("https://console.jumpcloud.com/login/admin");
        } catch (error) {
          log("Error connecting to Jumpcloud: " + error, "error");
          resolve(jsonResponse({ success: false, error: String(error) }, 500));
        }
      });
    }

    // -----------------------------------------------------------------
    // ENDPOINT: CONNECT SIPGN
    // -----------------------------------------------------------------
    if (url.pathname === "/api/connect-sipgn" && req.method === "GET") {
      log("Connecting SIPGN...", "info");

      return new Promise(async (resolve) => {
        try {
          const sipgnTab = await browser.newPage();
          let isResolved = false;

          sipgnTab.on("request", async (request) => {
            if (isResolved) return;

            const targetApiUrl =
              "/api/v1/sipai-dashboard/sppg-connected?limit=1";

            if (request.url().includes(targetApiUrl)) {
              const headers = request.headers();
              const authHeader =
                headers["authorization"] || headers["Authorization"];

              if (
                authHeader &&
                authHeader.toLowerCase().startsWith("bearer ")
              ) {
                isResolved = true;
                sipgnBearerToken = authHeader.split(" ")[1];
                log("Successfully getting Bearer Token SIPGN!", "success");

                await mainTab.bringToFront();
                resolve(jsonResponse({ success: true }));
              }
            }
          });

          await sipgnTab.goto("https://sipgn-sipai-dashboard.bgn.go.id");
        } catch (error) {
          resolve(jsonResponse({ success: false, error: String(error) }, 500));
        }
      });
    }

    // -----------------------------------------------------------------
    // ENDPOINT: ACTION SECTION 1 (JC SINGLE)
    // -----------------------------------------------------------------
    if (url.pathname === "/api/action-jc" && req.method === "POST") {
      if (!jumpcloudCookie)
        return jsonResponse(
          { success: false, error: "Belum Connect JC!" },
          401,
        );

      try {
        const { id } = await req.json();
        // TODO: Ganti URL target API Jumpcloud ini sesuai kebutuhan datamu
        const response = await fetch(
          `https://console.jumpcloud.com/api/users/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: jumpcloudCookie,
            },
          },
        );
        const data = await response.json();
        return jsonResponse({ success: true, data });
      } catch (error) {
        return jsonResponse({ success: false, error: String(error) }, 500);
      }
    }

    // -----------------------------------------------------------------
    // ENDPOINT: ACTION SECTION 2 (JC BULK)
    // -----------------------------------------------------------------
    if (url.pathname === "/api/action-jc-bulk" && req.method === "POST") {
      if (!jumpcloudCookie)
        return jsonResponse(
          { success: false, error: "Belum Connect JC!" },
          401,
        );

      try {
        const { ids } = await req.json();
        const promises = ids.map(async (id: string) => {
          try {
            // TODO: Ganti URL target API Jumpcloud ini
            const response = await fetch(
              `https://console.jumpcloud.com/api/users/${id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Cookie: jumpcloudCookie as string,
                },
              },
            );
            const data = await response.json();
            return { id, status: "success", data };
          } catch (err) {
            return { id, status: "error", error: String(err) };
          }
        });

        const results = await Promise.all(promises);
        return jsonResponse({ success: true, data: results });
      } catch (error) {
        return jsonResponse({ success: false, error: String(error) }, 500);
      }
    }

    if (url.pathname === "/api/jumpcloud/check" && req.method === "POST") {
      return checkStatusJc(req, jumpcloudCookie);
    }

    if (url.pathname === "/api/pemantauan/check" && req.method === "POST") {
      return checkPemantauanCctv(req, sipgnBearerToken);
    }

    // -----------------------------------------------------------------
    // ENDPOINT: ACTION SECTION 3 (SIPGN SINGLE)
    // -----------------------------------------------------------------
    if (url.pathname === "/api/action-sipgn" && req.method === "POST") {
      if (!sipgnBearerToken)
        return jsonResponse(
          { success: false, error: "Belum Connect SIPGN!" },
          401,
        );

      try {
        const { id } = await req.json();
        // TODO: Ganti URL target API SIPGN ini sesuai kebutuhan datamu
        const response = await fetch(
          `https://website-sipgn.com/api/v1/pemantauan/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sipgnBearerToken}`,
            },
          },
        );
        const data = await response.json();
        return jsonResponse({ success: true, data });
      } catch (error) {
        return jsonResponse({ success: false, error: String(error) }, 500);
      }
    }

    // -----------------------------------------------------------------
    // ENDPOINT: ACTION SECTION 4 (SIPGN BULK)
    // -----------------------------------------------------------------
    if (url.pathname === "/api/action-sipgn-bulk" && req.method === "POST") {
      if (!sipgnBearerToken)
        return jsonResponse(
          { success: false, error: "Belum Connect SIPGN!" },
          401,
        );

      try {
        const { ids } = await req.json();
        const promises = ids.map(async (id: string) => {
          try {
            // TODO: Ganti URL target API SIPGN ini
            const response = await fetch(
              `https://website-sipgn.com/api/v1/pemantauan/${id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sipgnBearerToken}` as string,
                },
              },
            );
            const data = await response.json();
            return { id, status: "success", data };
          } catch (err) {
            return { id, status: "error", error: String(err) };
          }
        });

        const results = await Promise.all(promises);
        return jsonResponse({ success: true, data: results });
      } catch (error) {
        return jsonResponse({ success: false, error: String(error) }, 500);
      }
    }

    return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
  },
});

async function init() {
  log("Running engine on http://localhost:4000", "success");
  try {
    browser = await puppeteer.launch({
      headless: false,
      channel: "chrome",
      defaultViewport: null,
      args: ["--start-fullscreen"],
    });

    const pages = await browser.pages();
    mainTab = pages.length > 0 ? pages[0] : await browser.newPage();

    await mainTab.goto("http://localhost:5173");

    log("Open UI Frontend", "success");
  } catch (error) {
    log("Gagal membuka browser: " + error, "error");
  }
}

init();
