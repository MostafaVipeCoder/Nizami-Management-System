import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

interface QRScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const hasScanned = useRef(false);

    useEffect(() => {
        const scannerId = "qr-reader";

        scannerRef.current = new Html5Qrcode(scannerId);

        const config = {
            fps: 15, // Smoothness
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
        };

        scannerRef.current.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                if (hasScanned.current) return;

                const cleanedText = decodedText.trim();
                if (cleanedText) {
                    hasScanned.current = true;
                    // Provide haptic feedback if available
                    if ('vibrate' in navigator) {
                        navigator.vibrate(100);
                    }
                    onScan(cleanedText);
                    stopScanner();
                }
            },
            (errorMessage) => {
                // Ignore constant errors like QR not found in frame
            }
        ).catch((err) => {
            console.error("Scanner start error:", err);
        });

        return () => {
            stopScanner();
        };
    }, []);

    const stopScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
            } catch (err) {
                console.error("Scanner stop error:", err);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-right">
            <div className="w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 left-6 z-10 p-3 rounded-2xl bg-white/20 backdrop-blur-md text-slate-800 hover:bg-white/40 transition-all border border-slate-200"
                >
                    <X size={24} />
                </button>

                <div className="p-10 pb-4 text-center">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">ماسح الرمز السريع</h3>
                    <p className="text-slate-400 text-sm font-bold">ضع كود الموظف داخل المربع ليتم المسح تلقائياً</p>
                </div>

                <div className="px-10 pb-10">
                    <div id="qr-reader" className="w-full overflow-hidden rounded-[2rem] border-4 border-orange-500/20 shadow-inner bg-slate-50" />
                </div>

                <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">انتظار المسح...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
