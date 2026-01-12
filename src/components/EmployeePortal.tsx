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
    Crown
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useNizamiStore } from '../store';

interface EmployeePortalProps {
    onBack: () => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({ onBack }) => {
    const { employees, attendance, recordAttendance, updateAttendance } = useNizamiStore();
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const activeEmployees = employees.filter(e => e.isActive);

    const getCurrentStatus = (employeeId: string) => {
        const today = new Date().toISOString().split('T')[0];
        return attendance.find(a => a.employeeId === employeeId && a.date === today && !a.timeOut);
    };

    const handleAction = async (employeeId: string) => {
        setLoading(true);
        const status = getCurrentStatus(employeeId);
        const now = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const today = new Date().toISOString().split('T')[0];

        try {
            if (status) {
                // Clock Out
                updateAttendance(status.id, { timeOut: now });
                setMessage({ text: 'تم تسجيل الانصراف بنجاح، شكراً لك!', type: 'success' });
            } else {
                // Clock In
                recordAttendance({
                    id: Math.random().toString(36).substr(2, 9),
                    employeeId,
                    date: today,
                    timeIn: now,
                });
                setMessage({ text: 'تم تسجيل الحضور بنجاح، بالتوفيق في عملك!', type: 'success' });
            }
            setSelectedEmployee(null);
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ text: 'حدث خطأ ما، يرجى المحاولة مرة أخرى', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col p-6 animate-fadeIn">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <button
                    onClick={onBack}
                    className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 text-slate-400 hover:text-white transition-all group"
                >
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1" />
                </button>
                <div className="text-right">
                    <h2 className="text-3xl font-black gold-gradient uppercase tracking-tight">بوابة الموظفين</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">نظام حضور نظامي العبقري</p>
                </div>
            </header>

            {message && (
                <div className={cn(
                    "max-w-md mx-auto w-full mb-8 p-6 rounded-[2rem] text-center font-bold animate-fadeIn",
                    message.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                )}>
                    {message.text}
                </div>
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
                                        "group relative p-8 rounded-[2.5rem] bg-[#0A0A0A] border-2 transition-all duration-500 text-right overflow-hidden",
                                        status ? "border-gold/30 gold-glow" : "border-white/5 hover:border-white/20"
                                    )}
                                >
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                status ? "bg-gold text-black" : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-white"
                                            )}>
                                                {status ? <LogOut size={24} /> : <LogIn size={24} />}
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                status ? "bg-gold text-black" : "bg-white/10 text-slate-400"
                                            )}>
                                                {status ? 'موجود حالياً' : 'غير مسجل'}
                                            </div>
                                        </div>

                                        <h4 className="text-xl font-black text-white mb-2 group-hover:text-gold transition-colors">{e.name}</h4>
                                        <p className="text-slate-500 text-xs font-medium mb-4">{e.phone}</p>

                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest gold-gradient">
                                                {status ? 'تسجيل انصراف' : 'ابدأ الشفت'}
                                            </span>
                                            <Fingerprint className={cn("w-5 h-5 transition-all text-slate-700", status ? "text-gold" : "group-hover:text-white")} />
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-600 font-bold mb-4">لا يوجد موظفين مسجلين حالياً</p>
                            <Zap className="w-12 h-12 text-slate-800 mx-auto" />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Branding */}
            <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gold/5 border border-gold/10">
                    <Crown className="w-4 h-4 text-gold" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">تم التحقق من الحضور المتميز</span>
                </div>
            </div>
        </div>
    );
};
