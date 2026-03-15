import { jsonResponse, log } from "../utils/utils";

export async function checkStatusJc(reqest: Request, cookie: string | null) {
  if (!cookie) {
    log("Jumpcloud not connected!", "error");
    return jsonResponse(
      { success: false, error: "Jumpcloud not connected!" },
      401,
    );
  }

  try {
    const { data: jcNames }: { data: string[] } = await reqest.json();

    const jcFunc = jcNames.map(async (jcName) => {
      const response = await fetch(
        `https://console.jumpcloud.com/api/systems?skip=0&limit=50&sort=displayName&search%5Bfields%5D%5B0%5D=agentVersion&search%5Bfields%5D%5B1%5D=amazonInstanceID&search%5Bfields%5D%5B2%5D=arch&search%5Bfields%5D%5B3%5D=displayName&search%5Bfields%5D%5B4%5D=hostname&search%5Bfields%5D%5B5%5D=networkInterfaces.address&search%5Bfields%5D%5B6%5D=osFamily&search%5Bfields%5D%5B7%5D=os&search%5Bfields%5D%5B8%5D=osVersionDetail.majorNumber&search%5Bfields%5D%5B9%5D=remoteIP&search%5Bfields%5D%5B10%5D=serialNumber&search%5Bfields%5D%5B11%5D=version&search%5Bfields%5D%5B12%5D=description&search%5BsearchTerm%5D=${jcName}`,
        {
          method: "GET",
          headers: {
            Cookie: cookie,
            "Content-Type": "application/json",
          },
        },
      );

      const { results } = await response.json();

      if (results.length === 0) {
        return {
          name: jcName,
          isActive: false,
        };
      }

      const ubuntuDevice = results.find(
        (result: any) => result.os === "Ubuntu",
      );

      return {
        name: ubuntuDevice.displayName as string,
        isActive: ubuntuDevice.active as boolean,
      };
    });

    log("Try to get Jumpcloud status", "info");
    const data = await Promise.all(jcFunc);
    log("Successfully getting Jumpcloud status", "success");

    return jsonResponse({ success: true, data });
  } catch (error) {
    log("Error getting Jumpcloud status", "error");
    return jsonResponse({ success: false, error: String(error) }, 500);
  }
}

export async function checkPemantauanCctv(
  request: Request,
  token: string | null,
) {
  if (!token) {
    log("SIPGN not connected yet", "error");
    return jsonResponse(
      { success: false, error: "SIPGN not connected yet" },
      401,
    );
  }

  try {
    const { data: sppgCodes }: { data: string[] } = await request.json();

    const sppgFunc = sppgCodes.map(async (sppgCode) => {
      const URL = `https://sipgn-api.bgn.go.id/api/v1/sipai-dashboard/sppg-connected?has_streaming=true&search=${sppgCode}`;
      const EXIT_CODE_FOUND = 0;
      const EXIT_CODE_NOT_FOUND = 1;
      const EXIT_CODE_ERROR = 2;

      const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { data } = await response.json();
      const { items } = data;

      if (items.length === 0) {
        return {
          sppgCode,
          isShow: false,
          exitCode: EXIT_CODE_NOT_FOUND,
        };
      }

      return {
        sppgCode,
        isShow: true,
        exitCode: EXIT_CODE_FOUND,
      };
    });

    log("Try to get SIPGN status", "info");
    const data = await Promise.all(sppgFunc);
    log("Successfully getting SIPGN status", "success");

    return jsonResponse({ success: true, data });
  } catch (error) {
    log("Error getting SIPGN status", "error");
    return jsonResponse({ success: false, error: String(error) }, 500);
  }
}
