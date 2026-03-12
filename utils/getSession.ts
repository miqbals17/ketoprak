import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface AccountData {
  jcCookie: string;
  sipgnToken: string;
}

export async function isAccountFileExists(exeDir: string) {
  const lokasiFile = join(exeDir, "data", "account.json");

  try {
    await access(lokasiFile);
    return true;
  } catch {
    return false;
  }
}

export async function getSession(exeDir: string): Promise<AccountData | null> {
  try {
    const accountSessionFile = join(exeDir, "data", "account.json");

    const accountSession = await readFile(accountSessionFile, "utf-8");
    const accountData = JSON.parse(accountSession);

    return accountData;
  } catch {
    console.log("Tidak ada session tersimpan");
    return null;
  }
}

export async function setSession(exeDir: string, accountData: AccountData) {
  try {
    const accountSessionFile = join(exeDir, "data", "account.json");

    await mkdir(join(exeDir, "data"), { recursive: true });
    await writeFile(
      accountSessionFile,
      JSON.stringify(accountData, null, 2),
      "utf-8",
    );
  } catch (err) {
    throw err;
  }
}
