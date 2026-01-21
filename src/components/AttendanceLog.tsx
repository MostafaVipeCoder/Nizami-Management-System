import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    User,
    History,
    Info,
    Edit,
    Trash2,
    Plus,
    X
} from 'lucide-react';
import { useNizamiStore } from '../store';
import { cn } from '../utils/cn';

export const AttendanceLog: React.FC = () => {
    const { attendance, employees, updateAttendance, deleteAttendance, recordAttendance } = useNizamiStore();
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newRecord, setNewRecord] = useState({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        timeIn: '09:00',
        timeOut: '17:00'
    });

    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'موظف غير معروف';

    // Sort by date and time
    const sorted = [...attendance].sort((a, b) =>
        new Date(b.date + 'T' + b.timeIn).getTime() - new Date(a.date + 'T' + a.timeIn).getTime()
    );

    const handleSaveEdit = () => {
        if (!editingRecord) return;
        updateAttendance(editingRecord.id, {
            timeIn: editingRecord.timeIn,
            timeOut: editingRecord.timeOut,
            date: editingRecord.date
        });
        setEditingRecord(null);
    };

    const handleAddManual = () => {
        if (!newRecord.employeeId) return;
        recordAttendance({
            id: Math.random().toString(36).substr(2, 9),
            ...newRecord
        });
        setIsAdding(false);
        setNewRecord({
            employeeId: '',
            date: new Date().toISOString().split('T')[0],
            timeIn: '09:00',
            timeOut: '17:00'
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn px-4 md:px-0">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">سجل النشاط اليومي</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-6 py-3 rounded-xl primary-bg text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                >
                    <Plus size={16} />
                    <span>تسجيل يدوي</span>
                </button>
            </div>

            {/* Table Header - Desktop Only */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-10 py-5 rounded-2xl bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                <span className="col-span-2">الموظف / التاريخ</span>
                <span>تسجيل حضور</span>
                <span>تسجيل انصراف</span>
                <span>المدة</span>
                <span className="text-left">إجراءات</span>
            </div>

            <div className="space-y-4">
                {sorted.map((record) => {
                    const hoursVal = record.timeOut
                        ? calculateHours(record.timeIn, record.timeOut)
                        : '-';

                    return (
                        <div
                            key={record.id}
                            className="flex flex-col md:grid md:grid-cols-6 gap-4 items-start md:items-center px-6 md:px-10 py-6 rounded-3xl bg-white border border-slate-100 hover:border-orange-200 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
                        >
                            {/* Employee Info */}
                            <div className="md:col-span-2 flex items-center gap-4 w-full">
                                <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-slate-900 font-bold text-lg md:text-base">{getEmployeeName(record.employeeId)}</h5>
                                    <p className="text-slate-400 text-xs font-medium">{record.date}</p>
                                </div>
                            </div>

                            {/* Check In */}
                            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-slate-900 font-black tracking-widest">{record.timeIn}</span>
                            </div>

                            {/* Check Out */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    record.timeOut ? "bg-red-50" : "bg-slate-50"
                                )}>
                                    {record.timeOut ? <ArrowDownRight className="w-4 h-4 text-red-600" /> : <Clock className="w-4 h-4 text-slate-300 animate-pulse" />}
                                </div>
                                <span className={cn(
                                    "font-black tracking-widest",
                                    record.timeOut ? "text-slate-900" : "text-slate-300 italic text-[10px]"
                                )}>
                                    {record.timeOut || 'قيد العمل...'}
                                </span>
                            </div>

                            {/* Duration */}
                            <div className="hidden md:block">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    record.timeOut ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-400"
                                )}>
                                    {hoursVal} {hoursVal !== '-' ? 'ساعة' : ''}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 w-full md:w-auto md:justify-end mt-4 md:mt-0">
                                <button
                                    onClick={() => setEditingRecord(record)}
                                    className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => deleteAttendance(record.id)}
                                    className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Interactive Accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    );
                })}

                {sorted.length === 0 && (
                    <div className="py-32 text-center text-slate-300 flex flex-col items-center">
                        <History size={48} className="mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-[0.3em] text-[10px]">لا توجد سجلات نشاط حالياً</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                    <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl animate-fadeIn relative">
                        <button onClick={() => setEditingRecord(null)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-900">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-black text-slate-900 mb-8 text-center uppercase tracking-tight">تعديل سجل الحضور</h3>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">التاريخ</label>
                                <input
                                    type="date"
                                    value={editingRecord.date}
                                    onChange={(e) => setEditingRecord({ ...editingRecord, date: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">وقت الحضور</label>
                                    <input
                                        type="time"
                                        value={editingRecord.timeIn}
                                        onChange={(e) => setEditingRecord({ ...editingRecord, timeIn: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">وقت الانصراف</label>
                                    <input
                                        type="time"
                                        value={editingRecord.timeOut || ''}
                                        onChange={(e) => setEditingRecord({ ...editingRecord, timeOut: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSaveEdit}
                                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                            >
                                حفظ التعديلات
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                    <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl animate-fadeIn relative text-right">
                        <button onClick={() => setIsAdding(false)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-900">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-black text-slate-900 mb-8 text-center uppercase tracking-tight">تسجيل حضور يدوي</h3>

                        <div className="space-y-6 text-right">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">الموظف</label>
                                <select
                                    value={newRecord.employeeId}
                                    onChange={(e) => setNewRecord({ ...newRecord, employeeId: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                >
                                    <option value="">اختر الموظف...</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">التاريخ</label>
                                <input
                                    type="date"
                                    value={newRecord.date}
                                    onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">وقت الحضور</label>
                                    <input
                                        type="time"
                                        value={newRecord.timeIn}
                                        onChange={(e) => setNewRecord({ ...newRecord, timeIn: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">وقت الانصراف</label>
                                    <input
                                        type="time"
                                        value={newRecord.timeOut}
                                        onChange={(e) => setNewRecord({ ...newRecord, timeOut: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddManual}
                                className="w-full py-5 rounded-2xl primary-bg text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                            >
                                تسجيل العملية
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
