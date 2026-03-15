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
import { useState } from "react";
import { Loader } from "lucide-react";
import type { JumpcloudStatus } from "./interfaces/jumpcloud";
import type { Status } from "./interfaces/connection";
import { getJumpcloudStatus } from "./lib/services";

interface Props {
  status: Status;
}

export default function AppJumpcloudStatus({ status }: Props) {
  const [jumpcloudNames, setJumpcloudNames] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<JumpcloudStatus[]>([]);

  const isConnected = status.connected;

  const handleCheckJumpcloudStatusBulk = async () => {
    setIsLoading(true);

    try {
      const jcNames = jumpcloudNames.split("\n");

      const status = await getJumpcloudStatus(jcNames);
      setResults(status);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cek Jumpcloud by Device Name</CardTitle>
        <CardDescription>
          Cek SPPG online atau offline di Jumpcloud
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Field orientation="vertical">
          <Textarea
            placeholder={`Contoh:\nSPPG-0001\nSPPG-0002\nSPPG-0003`}
            className="resize-none max-h-36"
            value={jumpcloudNames}
            onChange={(e) => setJumpcloudNames(e.target.value)}
          />
          <Button
            onClick={handleCheckJumpcloudStatusBulk}
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
          ) : results?.length > 0 ? (
            results?.map((status, index) => (
              <p key={index}>
                {status?.isActive ? (
                  <span className="text-green-500 font-medium">Online</span>
                ) : (
                  <span className="text-red-500 font-medium">Offline </span>
                )}{" "}
                - {status?.name}
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
