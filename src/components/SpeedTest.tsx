import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpeedGauge } from "./SpeedGauge";
import { Activity, Download, Upload, Zap } from "lucide-react";
import { toast } from "sonner";

interface TestResult {
  download: number;
  upload: number;
  ping: number;
  timestamp: Date;
}

export const SpeedTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<Partial<TestResult>>({});
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [testPhase, setTestPhase] = useState<"idle" | "ping" | "download" | "upload" | "complete">("idle");

  const simulateSpeedTest = async () => {
    setIsLoading(true);
    setCurrentTest({});
    
    try {
      // Simulate ping test
      setTestPhase("ping");
      await new Promise(resolve => setTimeout(resolve, 1000));
      const ping = Math.floor(Math.random() * 50) + 10;
      setCurrentTest(prev => ({ ...prev, ping }));
      
      // Simulate download test
      setTestPhase("download");
      await new Promise(resolve => setTimeout(resolve, 2000));
      const download = Math.floor(Math.random() * 200) + 50;
      setCurrentTest(prev => ({ ...prev, download }));
      
      // Simulate upload test
      setTestPhase("upload");
      await new Promise(resolve => setTimeout(resolve, 2000));
      const upload = Math.floor(Math.random() * 100) + 20;
      setCurrentTest(prev => ({ ...prev, upload }));
      
      setTestPhase("complete");
      
      const result: TestResult = {
        download,
        upload,
        ping,
        timestamp: new Date(),
      };
      
      setTestHistory(prev => [result, ...prev.slice(0, 4)]);
      toast.success("Speed test completed!");
    } catch (error) {
      toast.error("Failed to complete speed test");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Activity className="w-10 h-10 text-primary" />
            <h1 className="text-5xl font-bold glow-text">SpeedCheck</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Test your internet connection speed
          </p>
        </div>

        {/* Main Test Card */}
        <Card className="p-8 bg-card border-border">
          {testPhase === "idle" && (
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-muted-foreground">--</div>
              <Button
                onClick={simulateSpeedTest}
                disabled={isLoading}
                size="lg"
                className="px-12 py-6 text-lg glow-effect hover:scale-105 transition-transform"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Test
              </Button>
            </div>
          )}

          {testPhase !== "idle" && (
            <div className="grid md:grid-cols-3 gap-8">
              <SpeedGauge
                speed={currentTest.download || 0}
                maxSpeed={300}
                label="Download"
              />
              <SpeedGauge
                speed={currentTest.upload || 0}
                maxSpeed={150}
                label="Upload"
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary glow-text">
                    {currentTest.ping || "--"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">ms</div>
                </div>
                <div className="text-lg font-semibold">Ping</div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-primary">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm">
                  {testPhase === "ping" && "Testing ping..."}
                  {testPhase === "download" && "Testing download speed..."}
                  {testPhase === "upload" && "Testing upload speed..."}
                </span>
              </div>
            </div>
          )}

          {testPhase === "complete" && (
            <div className="mt-6 text-center">
              <Button
                onClick={simulateSpeedTest}
                variant="outline"
                className="glow-effect"
              >
                Test Again
              </Button>
            </div>
          )}
        </Card>

        {/* Test History */}
        {testHistory.length > 0 && (
          <Card className="p-6 bg-card border-border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Recent Tests
            </h2>
            <div className="space-y-4">
              {testHistory.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-success" />
                      <span className="text-sm text-muted-foreground">Download:</span>
                      <span className="font-semibold">{result.download} Mbps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-warning" />
                      <span className="text-sm text-muted-foreground">Upload:</span>
                      <span className="font-semibold">{result.upload} Mbps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Ping:</span>
                      <span className="font-semibold">{result.ping} ms</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
