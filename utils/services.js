//@ts-nocheck
export async function getStatusJumpcloud(sppgName, cookie) {
  try {
    const URL = "https://console.jumpcloud.com/api/systems";

    const response = await fetch(
      `https://console.jumpcloud.com/api/systems?skip=0&limit=50&sort=displayName&search%5Bfields%5D%5B0%5D=agentVersion&search%5Bfields%5D%5B1%5D=amazonInstanceID&search%5Bfields%5D%5B2%5D=arch&search%5Bfields%5D%5B3%5D=displayName&search%5Bfields%5D%5B4%5D=hostname&search%5Bfields%5D%5B5%5D=networkInterfaces.address&search%5Bfields%5D%5B6%5D=osFamily&search%5Bfields%5D%5B7%5D=os&search%5Bfields%5D%5B8%5D=osVersionDetail.majorNumber&search%5Bfields%5D%5B9%5D=remoteIP&search%5Bfields%5D%5B10%5D=serialNumber&search%5Bfields%5D%5B11%5D=version&search%5Bfields%5D%5B12%5D=description&search%5BsearchTerm%5D=${sppgName}`,
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
      console.log(`❌ Offline - ${sppgName}`);
      return {
        name: sppgName,
        isActive: false,
      };
    }

    const ubuntuDevice = results.find((result) => result.os === "Ubuntu");

    const printMessage = ubuntuDevice.active
      ? `✅ Online - ${ubuntuDevice.displayName}`
      : `❌ Offline - ${ubuntuDevice.displayName}`;
    console.log(printMessage);

    return {
      name: ubuntuDevice.displayName,
      isActive: ubuntuDevice.active,
    };
  } catch {
    throw new Error("Cookies Tidak Valid!");
  }
}
