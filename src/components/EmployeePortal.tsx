import React, { useState } from 'react';
import {
    ChevronRight,
    Clock,
    LogIn,
    LogOut,
    User,
    Fingerprint,
    Zap,
    ArrowRight,
    Crown,
    QrCode
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useNizamiStore } from '../store';
import { QRScanner } from './QRScanner';

interface EmployeePortalProps {
    onBack: () => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({ onBack }) => {
    const { employees, attendance, recordAttendance, updateAttendance } = useNizamiStore();
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const activeEmployees = employees.filter(e => e.isActive);

    const getCurrentStatus = (employeeId: string) => {
        const today = new Date().toISOString().split('T')[0];
        return attendance.find(a => a.employeeId === employeeId && a.date === today && !a.timeOut);
    };

    const handleAction = async (employeeId: string) => {
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) {
            setMessage({ text: 'عذراً، الموظف غير موجود', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        setLoading(true);
        const status = getCurrentStatus(employeeId);
        const now = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const today = new Date().toISOString().split('T')[0];

        try {
            if (status) {
                // Clock Out
                updateAttendance(status.id, { timeOut: now });
                setMessage({ text: `تم تسجيل انصراف ${employee.name} بنجاح، شكراً لك!`, type: 'success' });
            } else {
                // Clock In
                recordAttendance({
                    id: Math.random().toString(36).substr(2, 9),
                    employeeId,
                    date: today,
                    timeIn: now,
                });
                setMessage({ text: `تم تسجيل حضور ${employee.name} بنجاح، بالتوفيق!`, type: 'success' });
            }
            setSelectedEmployee(null);
            setTimeout(() => setMessage(null), 4000);
        } catch (err) {
            setMessage({ text: 'حدث خطأ ما، يرجى المحاولة مرة أخرى', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
            setIsScanning(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-6 animate-fadeIn pb-32">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <button
                    onClick={onBack}
                    className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all group shadow-sm"
                >
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1" />
                </button>
                <div className="text-right">
                    <h2 className="text-3xl font-black brand-gradient uppercase tracking-tight">بوابة الموظفين</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">نظام حضور نظامي العبقري</p>
                </div>
            </header>

            {message && (
                <div className={cn(
                    "max-w-md mx-auto w-full mb-8 p-6 rounded-[2rem] text-center font-bold animate-fadeIn shadow-lg",
                    message.type === 'success' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                )}>
                    {message.text}
                </div>
            )}

            {/* QR Scanner Component */}
            {isScanning && (
                <QRScanner
                    onScan={(id) => handleAction(id)}
                    onClose={() => setIsScanning(false)}
                />
            )}

            {/* Hero Selection */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full mb-20">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeEmployees.length > 0 ? (
                        activeEmployees.map((e) => {
                            const status = getCurrentStatus(e.id);
                            return (
                                <button
                                    key={e.id}
                                    onClick={() => handleAction(e.id)}
                                    disabled={loading}
                                    className={cn(
                                        "group relative p-8 rounded-[2.5rem] bg-white border-2 transition-all duration-500 text-right overflow-hidden shadow-xl",
                                        status ? "border-orange-500/20 shadow-orange-500/10" : "border-slate-50 hover:border-orange-500/20"
                                    )}
                                >
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md",
                                                status ? "primary-bg text-white" : "bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500"
                                            )}>
                                                {status ? <LogOut size={24} /> : <LogIn size={24} />}
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                status ? "primary-bg text-white" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {status ? 'موجود حالياً' : 'غير مسجل'}
                                            </div>
                                        </div>

                                        <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{e.name}</h4>
                                        <p className="text-slate-400 text-xs font-medium mb-4">{e.phone}</p>

                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest brand-gradient">
                                                {status ? 'تسجيل انصراف' : 'ابدأ الشفت'}
                                            </span>
                                            <Fingerprint className={cn("w-5 h-5 transition-all", status ? "text-orange-500" : "text-slate-300 group-hover:text-orange-500")} />
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 font-bold mb-4 text-xl">لا يوجد موظفين مسجلين حالياً</p>
                            <Zap className="w-12 h-12 text-slate-200 mx-auto" />
                        </div>
                    )}
                </div>
            </div>

            {/* QR Scan Button Floating */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
                <button
                    onClick={() => setIsScanning(true)}
                    className="flex items-center gap-4 px-10 py-6 rounded-[2.5rem] primary-bg text-white font-black shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all"
                >
                    <QrCode size={28} />
                    <span className="text-lg">فتح ماسح الكود</span>
                </button>
            </div>

            {/* Footer Branding */}
            <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-orange-500/5 border border-orange-500/10">
                    <Crown className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">تم التحقق من الحضور المتميز</span>
                </div>
            </div>
        </div>
    );
};
