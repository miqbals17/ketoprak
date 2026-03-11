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
      return {
        name: sppgName,
        isActive: false,
      };
    }

    const ubuntuDevice = results.find((result) => result.os === "Ubuntu");

    return {
      name: ubuntuDevice.displayName,
      isActive: ubuntuDevice.active,
    };
  } catch {
    throw new Error("Cookies Tidak Valid!");
  }
}

export async function syncSppg(sppgCode, token) {
  try {
    const URL = "https://sipgn-api.bgn.go.id/api/v1/sipai-dashboard/sppg/sync";

    const response = await fetch(`${URL}/${sppgCode}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    switch (response.status) {
      case 401:
        throw new Error("Token SIPGN tidak valid!");
      case 409:
        throw new Error("Conflict!");
      case 419:
        throw new Error("Token SIPGN telah expired!");
    }

    if (!response.ok || response.status !== 200)
      throw new Error("Gagal Sync SPPG!");

    console.log(`✅ Sukses - Sync SPPG ${sppgCode}`);
  } catch (error) {
    throw error;
  }
}

export async function getSppgData(sppgCode, token) {
  try {
    const URL = "https://sipgn-api.bgn.go.id/api/v1/sipai-dashboard/sppg";

    const response = await fetch(`${URL}/${sppgCode}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    switch (response.status) {
      case 401:
        throw new Error("Token SIPGN tidak valid!");
      case 409:
        throw new Error("Conflict!");
      case 419:
        throw new Error("Token SIPGN telah expired!");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editSppg(token, sppgCode, edgeDeviceData) {
  try {
    if (edgeDeviceData.edge_devices.length === 0) {
      console.log(
        `❌ Failed - Edit SPPG ${sppgCode} (Edge device belum dibuat)`,
      );
      return;
    }

    const URL = "https://sipgn-api.bgn.go.id/api/v1/sipai-dashboard/sppg";

    const response = await fetch(`${URL}/${sppgCode}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edgeDeviceData),
    });

    switch (response.status) {
      case 401:
        throw new Error("Token SIPGN tidak valid!");
      case 409:
        throw new Error("Conflict!");
      case 419:
        throw new Error("Token SIPGN telah expired!");
    }

    if (!response.ok || response.status !== 200)
      throw new Error("Gagal Edit Edge Device!");

    console.log(`✅ Sukses - Edit SPPG ${sppgCode}`);
  } catch (error) {
    throw error;
  }
}

export async function getStatusPemantauanCctv(sppgCode, token) {
  try {
    const URL = `https://sipgn-api.bgn.go.id/api/v1/sipai-dashboard/sppg-connected?has_streaming=true&search=${sppgCode}`;

    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    switch (response.status) {
      case 401:
        throw new Error("Token SIPGN tidak valid!");
      case 409:
        throw new Error("Conflict!");
      case 419:
        throw new Error("Token SIPGN telah expired!");
    }

    const { data } = await response.json();
    const { items } = data;

    if (items.length === 0) {
      return {
        sppgCode,
        isShow: false,
      };
    }

    return {
      sppgCode,
      isShow: true,
    };
  } catch (error) {
    throw error;
  }
}
