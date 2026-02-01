import React, { useState } from 'react';
import {
    Sun,
    Moon,
    Clock,
    Save,
    RotateCcw,
    ShieldCheck,
    Coffee
} from 'lucide-react';
import { useNizamiStore } from '../store';
import { cn } from '../utils/cn';

export const SettingsPage: React.FC = () => {
    const { settings, updateSettings } = useNizamiStore();
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = async () => {
        await updateSettings(localSettings);
        alert('تم حفظ الإعدادات بنجاح');
    };

    const handleReset = async () => {
        if (window.confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟')) {
            const defaults = {
                morningShift: { start: '08:00', end: '16:00', duration: 8 },
                eveningShift: { start: '16:00', end: '00:00', duration: 8 }
            };
            setLocalSettings(defaults);
            await updateSettings(defaults);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-slate-900 mb-2">إعدادات النظام</h3>
                    <p className="text-slate-400 font-medium text-sm">تخصيص مواعيد الشفتات ومعايير الالتزام</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button
                        onClick={handleReset}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all group"
                        title="استعادة الافتراضي"
                    >
                        <RotateCcw size={20} className="group-hover:rotate-[-45deg] transition-transform" />
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-4 primary-bg text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20"
                    >
                        <Save size={20} />
                        <span>حفظ التغييرات</span>
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-[0.02] blur-[100px] pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Morning Shift Card */}
                <div className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-xl relative group hover:border-orange-200 transition-all">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                            <Sun className="text-orange-500" size={24} />
                        </div>
                        <h4 className="text-xl font-black text-slate-900">الشفت الصباحي</h4>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">وقت الحضور</label>
                                <input
                                    type="time"
                                    value={localSettings.morningShift.start}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        morningShift: { ...localSettings.morningShift, start: e.target.value }
                                    })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-black outline-none focus:border-orange-500/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">وقت الانصراف</label>
                                <input
                                    type="time"
                                    value={localSettings.morningShift.end}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        morningShift: { ...localSettings.morningShift, end: e.target.value }
                                    })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-black outline-none focus:border-orange-500/30"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">عدد الساعات الإجمالي</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={localSettings.morningShift.duration}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        morningShift: { ...localSettings.morningShift, duration: Number(e.target.value) }
                                    })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-12 text-slate-900 font-black outline-none focus:border-orange-500/30"
                                />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-orange-500 opacity-0 group-hover:opacity-[0.03] blur-3xl transition-all" />
                </div>

                {/* Evening Shift Card */}
                <div className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-xl relative group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <Moon className="text-blue-500" size={24} />
                        </div>
                        <h4 className="text-xl font-black text-slate-900">الشفت المسائي</h4>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">وقت الحضور</label>
                                <input
                                    type="time"
                                    value={localSettings.eveningShift.start}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        eveningShift: { ...localSettings.eveningShift, start: e.target.value }
                                    })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-black outline-none focus:border-orange-500/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">وقت الانصراف</label>
                                <input
                                    type="time"
                                    value={localSettings.eveningShift.end}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        eveningShift: { ...localSettings.eveningShift, end: e.target.value }
                                    })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-black outline-none focus:border-orange-500/30"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">عدد الساعات الإجمالي</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={localSettings.eveningShift.duration}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        eveningShift: { ...localSettings.eveningShift, duration: Number(e.target.value) }
                                    })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-12 text-slate-900 font-black outline-none focus:border-orange-500/30"
                                />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-blue-500 opacity-0 group-hover:opacity-[0.03] blur-3xl transition-all" />
                </div>
            </div>

            {/* Attendance Rules Section */}
            <div className="p-10 rounded-[3rem] bg-orange-50/30 border border-orange-100 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                    <ShieldCheck className="text-orange-500" size={32} />
                    <h4 className="text-2xl font-black text-slate-900">قواعد الالتزام</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <p className="text-slate-800 font-bold text-sm">التأخير المسموح</p>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed font-bold">يتم احتساب التأخير بعد مرور 15 دقيقة من موعد الشفت الرسمي الموضح أعلاه.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <p className="text-slate-800 font-bold text-sm">الانصراف المبكر</p>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed font-bold">يتم تنبيه المدير في حالة تسجيل الانصراف قبل اكتمال عدد الساعات المحدد للشفت.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <p className="text-slate-800 font-bold text-sm">الساعات الإضافية</p>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed font-bold">يتم احتساب أي ساعة عمل خارج موعد الشفت كأجر إضافي يتم إضافته لصافي الراتب.</p>
                    </div>
                </div>
                <Coffee className="absolute -bottom-10 -left-10 w-40 h-40 text-orange-500/[0.03] rotate-12" />
            </div>
        </div>
    );
};
