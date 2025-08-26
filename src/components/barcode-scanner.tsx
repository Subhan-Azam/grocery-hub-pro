import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScannerConfig } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Scan, Keyboard } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onClose,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    const config: Html5QrcodeScannerConfig = {
      fps: 10,
      qrbox: { width: 300, height: 200 },
      aspectRatio: 1.777778,
    };

    scannerRef.current = new Html5QrcodeScanner(
      "barcode-scanner",
      config,
      false
    );

    const onScanSuccess = (decodedText: string) => {
      onScan(decodedText);
      cleanup();
    };

    const onScanFailure = (error: string) => {
      // Handle scan failure silently
      console.warn("Scan error:", error);
    };

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return cleanup;
  }, [onScan]);

  const cleanup = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  return (
    <div className="space-y-4">
      {!showManualInput ? (
        <>
          <div id="barcode-scanner" className="w-full" />
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowManualInput(true)}
              className="flex items-center gap-2"
            >
              <Keyboard className="h-4 w-4" />
              Manual Entry
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center py-8">
            <Keyboard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Manual Barcode Entry</h3>
            <p className="text-muted-foreground mb-4">
              Enter the barcode manually
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Label htmlFor="manual-barcode">Barcode</Label>
              <Input
                id="manual-barcode"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode..."
                autoFocus
              />
            </div>
            <div className="flex justify-center space-x-2">
              <Button type="submit" disabled={!manualBarcode.trim()}>
                Add Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowManualInput(false)}
              >
                <Scan className="h-4 w-4 mr-2" />
                Back to Scanner
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
