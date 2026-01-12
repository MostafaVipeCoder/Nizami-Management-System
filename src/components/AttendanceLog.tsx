import React from 'react';
import {
    Calendar,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    User,
    History,
    Info
} from 'lucide-react';
import { useNizamiStore } from '../store';
import { cn } from '../utils/cn';

export const AttendanceLog: React.FC = () => {
    const { attendance, employees } = useNizamiStore();

    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'موظف غير معروف';

    // Sort by date and time
    const sorted = [...attendance].sort((a, b) =>
        new Date(b.date + 'T' + b.timeIn).getTime() - new Date(a.date + 'T' + a.timeIn).getTime()
    );

    return (
        <div className="space-y-6 animate-fadeIn px-4 md:px-0">
            {/* Table Header - Desktop Only */}
            <div className="hidden md:grid grid-cols-5 gap-4 px-10 py-5 rounded-2xl bg-[#0A0A0A] border border-white/5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
                <span className="col-span-2">الموظف / التاريخ</span>
                <span>تسجيل حضور</span>
                <span>تسجيل انصراف</span>
                <span>المدة</span>
            </div>

            <div className="space-y-4">
                {sorted.map((record) => {
                    const hoursVal = record.timeOut
                        ? calculateHours(record.timeIn, record.timeOut)
                        : '-';

                    return (
                        <div
                            key={record.id}
                            className="flex flex-col md:grid md:grid-cols-5 gap-4 items-start md:items-center px-6 md:px-10 py-6 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-gold/30 transition-all group relative overflow-hidden"
                        >
                            {/* Employee Info */}
                            <div className="md:col-span-2 flex items-center gap-4 w-full">
                                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <User className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-white font-bold text-lg md:text-base">{getEmployeeName(record.employeeId)}</h5>
                                    <p className="text-slate-500 text-xs font-medium">{record.date}</p>
                                </div>
                                {/* Mobile Duration Badge */}
                                <div className="md:hidden">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest block",
                                        record.timeOut ? "bg-gold/10 text-gold" : "bg-white/5 text-slate-700"
                                    )}>
                                        {hoursVal} {hoursVal !== '-' ? 'س' : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Check In */}
                            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="md:hidden text-[10px] text-slate-500 font-black uppercase tracking-widest mr-auto">بدايه المناوبة:</div>
                                <span className="text-white font-black tracking-widest">{record.timeIn}</span>
                            </div>

                            {/* Check Out */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    record.timeOut ? "bg-red-500/10" : "bg-white/5"
                                )}>
                                    {record.timeOut ? <ArrowDownRight className="w-4 h-4 text-red-500" /> : <Clock className="w-4 h-4 text-slate-700 animate-pulse" />}
                                </div>
                                <div className="md:hidden text-[10px] text-slate-500 font-black uppercase tracking-widest mr-auto">نهاية المناوبة:</div>
                                <span className={cn(
                                    "font-black tracking-widest",
                                    record.timeOut ? "text-white" : "text-slate-700 italic text-[10px]"
                                )}>
                                    {record.timeOut || 'قيد العمل...'}
                                </span>
                            </div>

                            {/* Duration - Desktop Only */}
                            <div className="hidden md:block">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    record.timeOut ? "bg-gold/10 text-gold" : "bg-white/5 text-slate-700"
                                )}>
                                    {hoursVal} {hoursVal !== '-' ? 'ساعة' : ''}
                                </span>
                            </div>

                            {/* Interactive Accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    );
                })}

                {sorted.length === 0 && (
                    <div className="py-32 text-center text-slate-700 flex flex-col items-center">
                        <History size={48} className="mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-[0.3em] text-[10px]">لا توجد سجلات نشاط حالياً</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const calculateHours = (inStr: string, outStr: string): string => {
    try {
        const standardize = (s: string) => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
        const t1 = standardize(inStr).split(':').map(Number);
        const t2 = standardize(outStr).split(':').map(Number);

        let totalMin = (t2[0] * 60 + t2[1]) - (t1[0] * 60 + t1[1]);
        if (totalMin < 0) totalMin += 24 * 60;

        const result = totalMin / 60;
        return isNaN(result) ? '0.0' : result.toFixed(1);
    } catch {
        return '0.0';
    }
};
