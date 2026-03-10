import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import {
  editSppg,
  getSppgData,
  getStatusJumpcloud,
  getStatusPemantauanCctv,
  syncSppg,
} from "./utils/services.js";

async function checkStatusJCBySPPGName(rl, cookie) {
  try {
    const sppgName = await rl.question("Masukkan nama SPPG: ");
    console.log(`Mencari status JC...`);

    await getStatusJumpcloud(sppgName, cookie);
  } catch (error) {
    throw error;
  }
}

async function checkStatusJCBulk(rl, exeDir, cookie) {
  try {
    const sppgFile = await rl.question(
      'Masukkan nama file Jumpcloud SPPG (Enter untuk "jumpcloud.txt"): ',
    );
    const sppgFileName = sppgFile.trim() === "" ? "jumpcloud.txt" : sppgFile;
    const fileDir = join(exeDir, sppgFileName);

    const sppg = await readFile(fileDir, "utf-8");
    const sppgList = sppg.split("\n");

    const sppgFunc = sppgList.map((data) => {
      return getStatusJumpcloud(data, cookie);
    });

    console.log(`Mencari status JC...`);
    const sppgStatus = await Promise.all(sppgFunc);

    const sppgOnline = sppgStatus.filter((sppg) => sppg.isActive);
    const sppgOffline = sppgStatus.filter((sppg) => !sppg.isActive);
    console.log(
      `\nOnline: ${sppgOnline.length}, Offline: ${sppgOffline.length}`,
    );
  } catch (error) {
    throw error;
  }
}

async function checkPemantauanCctvBySPPGName(rl, token) {
  try {
    const sppgCode = await rl.question("Masukkan kode SPPG: ");
    console.log("\nSedang mengecek Pemantauan CCTV...");

    await getStatusPemantauanCctv(sppgCode, token);
  } catch (error) {
    throw error;
  }
}

async function checkPemantauanCctvBulk(rl, exeDir, token) {
  try {
    const sppgFile = await rl.question(
      'Masukkan nama file daftar Kode SPPG (Enter untuk "sppg-code.txt"): ',
    );
    const sppgFileName = sppgFile.trim() === "" ? "sppg-code.txt" : sppgFile;
    const sppgFileDir = join(exeDir, sppgFileName);

    const sppg = await readFile(sppgFileDir, "utf-8");
    const sppgList = sppg.split("\n");

    const syncSppgFunc = sppgList.map((sppgCode) => {
      return getStatusPemantauanCctv(sppgCode, token);
    });
    await Promise.all(syncSppgFunc);
  } catch (error) {
    throw error;
  }
}

async function mappingRTSPToSIPGN(rl, exeDir, token) {
  try {
    const ipFile = await rl.question(
      'Masukkan nama file daftar IP (Enter untuk "ip.txt"): ',
    );
    const ipFileName = ipFile.trim() === "" ? "ip.txt" : ipFile;
    const ipFileDir = join(exeDir, ipFileName);

    const ip = await readFile(ipFileDir, "utf-8");
    const ipList1D = ip.split("\n");
    const ipList2D = ipList1D.map((data) => {
      return data.split("\t");
    });

    const sppgFile = await rl.question(
      'Masukkan nama file daftar Kode SPPG (Enter untuk "sppg-code.txt"): ',
    );
    const sppgFileName = sppgFile.trim() === "" ? "sppg-code.txt" : sppgFile;
    const sppgFileDir = join(exeDir, sppgFileName);

    const sppg = await readFile(sppgFileDir, "utf-8");
    const sppgList = sppg.split("\n");

    if (ipList2D.length !== sppgList.length) {
      throw new Error("Jumlah baris IP dan SPPG tidak sama!");
    }

    console.log("\nProses Sync SPPG...");

    const syncSppgFunc = sppgList.map((sppgCode) => {
      return syncSppg(sppgCode, token);
    });
    await Promise.all(syncSppgFunc);

    const getDataSppgFunc = sppgList.map((sppgCode) => {
      return getSppgData(sppgCode, token);
    });
    const sppgDataList = await Promise.all(getDataSppgFunc);

    // Reset RTSP
    const resetRtspSppgPayload = sppgDataList.map((sppgData) => {
      if (sppgData.edge_devices.length === 0)
        return {
          code: sppgData.code,
          name: sppgData.name,
          province_id: sppgData.province.id,
          city_id: sppgData.city.id,
          district_id: sppgData.district.id,
          sub_district_id: sppgData.sub_district.id,
          edge_devices: [],
          head_id: null,
          streaming_url: null,
        };

      const cameras = [
        {
          id: sppgData.edge_devices[0].cameras[0].id,
          name: "cam-reset",
          types: [],
          threshold: 0.5,
          start_time: "00:00",
          end_time: "23:00",
          timezone: "Asia/Jakarta",
          rtsp_url: "rtsp://123:123/",
        },
      ];

      const edgeDevices = [
        {
          id: sppgData.edge_devices[0].id,
          name: sppgData.edge_devices[0].name,
          cameras,
        },
      ];

      return {
        code: sppgData.code,
        name: sppgData.name,
        province_id: sppgData.province.id,
        city_id: sppgData.city.id,
        district_id: sppgData.district.id,
        sub_district_id: sppgData.sub_district.id,
        edge_devices: edgeDevices,
        head_id: null,
        streaming_url: null,
      };
    });

    console.log("\nProses Reset RTSP SPPG...");

    const resetRtspSppgFunc = resetRtspSppgPayload.map((sppgPayload) => {
      const { code, ...payload } = sppgPayload;
      return editSppg(token, code, payload);
    });
    await Promise.all(resetRtspSppgFunc);

    // Get RTSP data again
    const getDataSppgFunc2 = sppgList.map((sppgCode) => {
      return getSppgData(sppgCode, token);
    });
    const sppgDataList2 = await Promise.all(getDataSppgFunc2);

    // Mapping RTSP
    const cctvOrder = [
      "masak",
      "pemorsian",
      "persiapan_masak",
      "gudang",
      "tempat_cuci",
    ];

    const mapRtspSppgPayload = sppgDataList2.map((sppgData, index) => {
      if (sppgData.edge_devices.length === 0)
        return {
          code: sppgData.code,
          name: sppgData.name,
          province_id: sppgData.province.id,
          city_id: sppgData.city.id,
          district_id: sppgData.district.id,
          sub_district_id: sppgData.sub_district.id,
          edge_devices: [],
          head_id: null,
          streaming_url: null,
        };

      const cameras = ipList2D[index].map((ipCctv, cameraIndex) => {
        if (cameraIndex === 0) {
          return {
            id: sppgData.edge_devices[0].cameras[0].id,
            name: cctvOrder[cameraIndex],
            types: ["apd"],
            threshold: 0.5,
            start_time: "00:00",
            end_time: "23:00",
            timezone: "Asia/Jakarta",
            rtsp_url: ipCctv ?? "rtsp://",
          };
        } else {
          return {
            name: cctvOrder[cameraIndex],
            types: [],
            threshold: 0.5,
            start_time: "00:00",
            end_time: "23:00",
            timezone: "Asia/Jakarta",
            rtsp_url: ipCctv ?? "rtsp://",
          };
        }
      });

      const edgeDevices = [
        {
          id: sppgData.edge_devices[0].id,
          name: sppgData.edge_devices[0].name,
          cameras,
        },
      ];

      return {
        code: sppgData.code,
        name: sppgData.name,
        province_id: sppgData.province.id,
        city_id: sppgData.city.id,
        district_id: sppgData.district.id,
        sub_district_id: sppgData.sub_district.id,
        edge_devices: edgeDevices,
        head_id: null,
        streaming_url: null,
      };
    });

    console.log("\nProses Mapping RTSP SPPG...");

    const mapRtspSppgFunc = mapRtspSppgPayload.map((sppgPayload) => {
      const { code, ...payload } = sppgPayload;
      return editSppg(token, code, payload);
    });
    await Promise.all(mapRtspSppgFunc);
  } catch (error) {
    throw error;
  }
}

async function main() {
  const rl = readline.createInterface({ input, output });

  rl.on("SIGINT", () => {
    console.log("\nTerima kasih telah menggunakan program ini. Sampai jumpa!");
    rl.close();
    process.exit(0);
  });

  try {
    console.log(`
██╗░░██╗███████╗████████╗░█████╗░██████╗░██████╗░░█████╗░██╗░░██╗
██║░██╔╝██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║░██╔╝
█████═╝░█████╗░░░░░██║░░░██║░░██║██████╔╝██████╔╝███████║█████═╝░
██╔═██╗░██╔══╝░░░░░██║░░░██║░░██║██╔═══╝░██╔══██╗██╔══██║██╔═██╗░
██║░╚██╗███████╗░░░██║░░░╚█████╔╝██║░░░░░██║░░██║██║░░██║██║░╚██╗
╚═╝░░╚═╝╚══════╝░░░╚═╝░░░░╚════╝░╚═╝░░░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝`);

    const execPath = process.execPath;
    const exeDir = dirname(execPath);

    const credentialsFile = await rl.question(
      '\nMasukkan nama file kredensial (Enter untuk "kerupuk.txt"): ',
    );
    const fileName =
      credentialsFile.trim() === "" ? "kerupuk.txt" : credentialsFile;
    const fileDir = join(exeDir, fileName);

    while (true) {
      console.log(`
-------------o-------------
Opsi Program:
1. Cek Status JC by SPPG Name
2. Cek Status JC Bulk
3. Cek Pemantauan CCTV by SPPG Name
4. Cek Pemantauan CCTV Bulk
5. Mapping RTSP ke SIPGN (Beta)
`);

      const selectedOption = await rl.question("Pilih opsi: ");

      if (selectedOption.trim().toLowerCase() === "exit") {
        console.log("\nKeluar dari program. Adios!");
        break;
      }

      try {
        const credentials = await readFile(fileDir, "utf-8");
        const credentialsList = credentials.split("\n");

        const cookie = credentialsList[0];
        const tokenSipgn = credentialsList[1];

        switch (selectedOption) {
          case "1":
            await checkStatusJCBySPPGName(rl, cookie);
            break;
          case "2":
            await checkStatusJCBulk(rl, exeDir, cookie);
            break;
          case "3":
            await checkPemantauanCctvBySPPGName(rl, tokenSipgn);
            break;
          case "4":
            await checkPemantauanCctvBulk(rl, exeDir, tokenSipgn);
            break;
          case "5":
            await mappingRTSPToSIPGN(rl, exeDir, tokenSipgn);
            break;
          default:
            console.log("\nOpsi tidak valid. Silakan pilih opsi yang benar.");
            break;
        }
      } catch (error) {
        console.log("\nAda error brow n sist:", error.message);
      }
    }
  } catch (error) {
    console.error("\nAda error brow n sist:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
