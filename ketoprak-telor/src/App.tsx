import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { useState } from "react";
import AppPemantauanCCTV from "./app-pemantauan-cctv";
import AppJumpcloudStatus from "./app-jumpcloud-status";
import type { Status } from "./interfaces/connection";

function App() {
  // Session
  const [jcStatus, setJcStatus] = useState<Status>({
    connected: false,
    status: "Disconnected",
  });
  const [sipgnStatus, setSipgnStatus] = useState<Status>({
    connected: false,
    status: "Disconnected",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConnectJC = async () => {
    setIsLoading(true);
    setJcStatus({ status: "⏳ Menunggu Login Jumpcloud...", connected: false });

    try {
      const res = await fetch("http://localhost:4000/api/connect-jc");
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch("http://localhost:4000/api/status-jc");
          const statusData = await statusRes.json();

          if (statusData.isConnected) {
            clearInterval(interval);
            setJcStatus({
              status: "Connected!",
              connected: true,
            });
            setIsLoading(false);
          }
        } catch (err) {
          console.log(err);
        }
      }, 2000);
    } catch (err) {
      setJcStatus({
        status: `${(err as Error).message}`,
        connected: false,
      });
      setIsLoading(false);
    }
  };

  const handleConnectSipgn = async () => {
    setIsLoading(true);
    setSipgnStatus({ status: "⏳ Menunggu Login SIPGN...", connected: false });

    try {
      const res = await fetch("http://localhost:4000/api/connect-sipgn");
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(
            "http://localhost:4000/api/status-sipgn",
          );
          const statusData = await statusRes.json();

          if (statusData.isConnected) {
            clearInterval(interval);
            setSipgnStatus({
              status: "Connected!",
              connected: true,
            });
            setIsLoading(false);
          }
        } catch (err) {
          console.log(err);
        }
      }, 2000);
    } catch (err) {
      setSipgnStatus({
        status: `${(err as Error).message}`,
        connected: false,
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Ketoprak Telor</CardTitle>
        <CardDescription>GUI untuk command-command Ketoprak</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 justify-between items-center">
            <Button
              variant="outline"
              disabled={isLoading || jcStatus.connected}
              onClick={handleConnectJC}
            >
              Connect Jumpcloud
            </Button>
            <span>Status Jumpcloud: {jcStatus.status}</span>
          </div>
          <div className="flex gap-2 justify-between items-center">
            <Button
              variant="outline"
              disabled={isLoading || sipgnStatus.connected}
              onClick={handleConnectSipgn}
            >
              Connect SIPGN
            </Button>
            <span>Status SIPGN: {sipgnStatus.status}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AppJumpcloudStatus status={jcStatus} />
          <AppPemantauanCCTV status={sipgnStatus} />
        </div>
      </CardContent>
    </Card>
  );
}

export default App;
