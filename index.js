import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { getStatusJumpcloud } from "./utils/services.js";

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
    const credentialsFile = await rl.question(
      'Masukkan nama file SPPG (Enter untuk "sppg.txt"): ',
    );
    const sppgFileName =
      credentialsFile.trim() === "" ? "sppg.txt" : credentialsFile;
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
      '\nMasukkan nama file kredensial (Enter untuk "credentials.txt"): ',
    );
    const fileName =
      credentialsFile.trim() === "" ? "credentials.txt" : credentialsFile;
    const fileDir = join(exeDir, fileName);

    while (true) {
      console.log(`
-------------o-------------
Opsi Program:
1. Cek Status JC by SPPG Name
2. Cek Status JC Bulk
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

        switch (selectedOption) {
          case "1":
            await checkStatusJCBySPPGName(rl, cookie);
            break;
          case "2":
            await checkStatusJCBulk(rl, exeDir, cookie);
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
