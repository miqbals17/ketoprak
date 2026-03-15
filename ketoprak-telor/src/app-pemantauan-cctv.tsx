import { useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Field } from "./components/ui/field";
import { Textarea } from "./components/ui/textarea";
import type { PemantauanStatus } from "./interfaces/sipgn";
import { Loader } from "lucide-react";
import type { Status } from "./interfaces/connection";
import { getPemantauanCctv } from "./lib/services";

interface Props {
  status: Status;
}

export default function AppPemantauanCCTV({ status }: Props) {
  const [sppgCodes, setSppgCodes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PemantauanStatus[]>([]);

  const isConnected = status.connected;

  const handleCheckPemantauanBySppgCodeBulk = async () => {
    setIsLoading(true);

    try {
      const codeList = sppgCodes.split("\n");

      const data = await getPemantauanCctv(codeList);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cek Pemantauan CCTV by SPPG Code</CardTitle>
        <CardDescription>
          Cek pemantauan CCTV sudah muncul atau belum berdasarkan kode SPPG
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Field orientation="vertical">
          <Textarea
            placeholder={`Contoh:\n32.01.40.2002.02\n32.71.04.1013.21\n32.71.05.1007.08\n32.01.03.2014.08\n32.01.07.2011.13`}
            className="resize-none max-h-36"
            value={sppgCodes}
            onChange={(e) => setSppgCodes(e.target.value)}
          />
          <Button
            onClick={handleCheckPemantauanBySppgCodeBulk}
            disabled={isLoading || !isConnected}
          >
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </Field>

        <div className="p-4 rounded-lg border flex flex-col gap-0 max-h-36 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : results.length > 0 ? (
            results.map((status, index) => (
              <p key={index}>
                {status.isShow ? (
                  <span className="text-green-500 font-medium">Muncul</span>
                ) : (
                  <span className="text-red-500 font-medium">Tidak Muncul</span>
                )}{" "}
                - {status.sppgCode}
              </p>
            ))
          ) : (
            <p className="text-center text-muted-foreground">Belum ada data</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
