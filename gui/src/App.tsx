import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jcStatus, setJcStatus] = useState<{
    text: string;
    isConnected: boolean;
  }>({
    text: "Belum terhubung",
    isConnected: false,
  });
  const [sipgnStatus, setSipgnStatus] = useState<{
    text: string;
    isConnected: boolean;
  }>({
    text: "Belum terhubung",
    isConnected: false,
  });

  const handleFetchApi = async () => {
    if (!input.trim()) {
      setError("Please enter a value");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Mock API call - replace with your actual endpoint
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1",
      );
      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSIPGN = async () => {
    setIsLoading(true);
    setSipgnStatus({ text: "⏳ Menunggu Login SIPGN...", isConnected: false });

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
              text: "✅ Connected! (Bearer Token Aman)",
              isConnected: true,
            });
            setIsLoading(false);
          }
        } catch (err) {
          console.log(err);
        }
      }, 2000);
    } catch (err) {
      setSipgnStatus({
        text: `❌ Gagal: ${(err as Error).message}`,
        isConnected: false,
      });
      setIsLoading(false);
    }
  };

  const handleConnectJC = async () => {
    setIsLoading(true);
    setJcStatus({ text: "⏳ Menunggu Login Jumpcloud...", isConnected: false });

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
              text: "✅ Connected! (Cookie Aman)",
              isConnected: true,
            });
            setIsLoading(false);
          }
        } catch (err) {
          console.log(err);
        }
      }, 2000);
    } catch (err) {
      setJcStatus({
        text: `❌ Gagal: ${(err as Error).message}`,
        isConnected: false,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header with Connection Buttons */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Integration Manager
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={handleConnectJC}
              disabled={isLoading || jcStatus.isConnected}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              Connect Jumpcloud
            </Button>
            <span style={{ marginLeft: "15px", fontWeight: "bold" }}>
              {jcStatus.text}
            </span>

            <Button
              onClick={handleConnectSIPGN}
              disabled={isLoading || sipgnStatus.isConnected}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Connect SIPGN
            </Button>
            <span style={{ marginLeft: "15px", fontWeight: "bold" }}>
              {sipgnStatus.text}
            </span>
          </div>
        </div>
      </div>

      {/* API Fetch Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Card className="bg-white shadow-lg border-slate-200">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Fetch Data
            </h2>

            {/* Input Section */}
            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter search term or parameter..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border-slate-300 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleFetchApi();
                    }
                  }}
                />
                <Button
                  onClick={handleFetchApi}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  {loading ? "Loading..." : "Fetch"}
                </Button>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>

            {/* Results Container */}
            {result && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Results
                </h3>
                <div className="bg-slate-900 rounded-lg p-6 overflow-auto max-h-96">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap wrap-break-word">
                    {result}
                  </pre>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="text-center py-12 text-slate-500">
                <p>Enter a value and click Fetch to see results here</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
