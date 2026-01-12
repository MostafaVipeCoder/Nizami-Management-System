import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Clock,
    Wallet,
    Settings,
    LogOut,
    Bell,
    Search,
    Plus,
    Crown
} from 'lucide-react';
import { EmployeeManagement } from './EmployeeManagement';
import { AttendanceLog } from './AttendanceLog';
import { PayrollReport } from './PayrollReport';
import { cn } from '../utils/cn';

interface OwnerDashboardProps {
    onLogout: () => void;
}

type Tab = 'overview' | 'employees' | 'attendance' | 'payroll' | 'settings';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'نظرة عامة' },
        { id: 'employees', icon: Users, label: 'الموظفين' },
        { id: 'attendance', icon: Clock, label: 'الحضور' },
        { id: 'payroll', icon: Wallet, label: 'الرواتب' },
        { id: 'settings', icon: Settings, label: 'الإعدادات' },
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#050505] overflow-hidden">
            {/* Mobile Top Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-[#0A0A0A] border-b border-gold/10 relative z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                        <Crown className="text-black w-4 h-4" />
                    </div>
                    <h1 className="text-lg font-black gold-gradient tracking-tight">نظامي</h1>
                </div>
                <button
                    onClick={onLogout}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                </button>
            </header>

            {/* Sidebar - Desktop Only */}
            <aside className="hidden md:flex w-80 border-l border-gold/10 bg-[#0A0A0A] flex-col relative z-20">
                <div className="p-8 pb-12">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center shadow-lg">
                            <Crown className="text-black w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black gold-gradient tracking-tight">نـظـامـي</h1>
                            <p className="text-[8px] text-slate-500 uppercase font-black tracking-[0.3em]">لوحة التحكم الإدارية</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as Tab)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group",
                                    activeTab === item.id
                                        ? "bg-gold/10 text-gold shadow-[0_0_30px_rgba(191,149,63,0.1)] border border-gold/20"
                                        : "text-slate-500 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-gold" : "group-hover:text-gold transition-colors")} />
                                <div className="text-right">
                                    <p className="font-bold text-sm">{item.label}</p>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/5">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group"
                    >
                        <span className="font-black text-xs uppercase tracking-widest">إنهاء الجلسة</span>
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 p-6 md:p-12 pb-32 md:pb-12">
                {/* Desktop Header Description */}
                <header className="hidden md:flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">
                            {navItems.find(i => i.id === activeTab)?.label}
                        </h2>
                        <p className="text-slate-500 font-medium">مرحباً بك في لوحة تحكم التميز الإداري.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0A0A0A] border border-white/5 shadow-xl">
                            <div className="text-right">
                                <p className="text-xs font-black text-white">المشرف العام</p>
                                <p className="text-[9px] text-gold uppercase font-black tracking-widest">إدارة النظام</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark p-[1px]">
                                <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-gold" />
                                </div>
                            </div>
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center hover:border-gold/30 transition-all">
                            <Bell className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </header>

                {/* Mobile Title */}
                <h2 className="md:hidden text-3xl font-black text-white mb-6">
                    {navItems.find(i => i.id === activeTab)?.label}
                </h2>

                {/* Dynamic Views */}
                <div className="animate-fadeIn">
                    {activeTab === 'overview' && <OverviewGrid />}
                    {activeTab === 'employees' && <EmployeeManagement />}
                    {activeTab === 'attendance' && <AttendanceLog />}
                    {activeTab === 'payroll' && <PayrollReport />}
                    {activeTab === 'settings' && <div className="text-center py-20 text-slate-500">قسم الإعدادات - قريباً</div>}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-gold/10 px-6 py-4 flex items-center justify-between z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all",
                            activeTab === item.id ? "text-gold scale-110" : "text-slate-500"
                        )}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

import { useNizamiStore } from '../store';
import { getEmployeePayrollSummary } from '../utils/payroll';

const OverviewGrid = () => {
    const { employees, attendance, transactions } = useNizamiStore();
    const activeMonth = new Date().toISOString().slice(0, 7);
    const today = new Date().toISOString().split('T')[0];

    // Real-time Workforce Stats
    const totalEmployeesCount = employees.length;
    const workingNowCount = attendance.filter(a => a.date === today && !a.timeOut).length;

    // Total payroll for the current month (Rounded to integer)
    const totalPayrollRaw = employees.reduce((acc, emp) => {
        const summary = getEmployeePayrollSummary(emp, attendance, transactions, activeMonth);
        return acc + summary.netSalary;
    }, 0);
    const totalPayroll = Math.round(totalPayrollRaw);

    const stats = [
        {
            label: 'القوى العاملة',
            value: `${workingNowCount}/${totalEmployeesCount}`,
            sub: 'موظف نشط حالياً',
            icon: Users,
            trend: `الإجمالي: ${totalEmployeesCount}`
        },
        {
            label: 'حالة الالتزام اليومي',
            value: (totalEmployeesCount - workingNowCount).toString(),
            sub: 'لم يسجلوا حضور اليوم',
            icon: Clock,
            trend: 'بانتظار اكتمال الفريق'
        },
        {
            label: 'إجمالي رواتب الشهر',
            value: totalPayroll.toLocaleString('en-US').split('.')[0],
            sub: 'جنيه مصري (صافي)',
            icon: Wallet,
            trend: 'حسب الساعات المسجلة'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, i) => (
                <div key={i} className="group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-gold/30 transition-all duration-500 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold opacity-0 group-hover:opacity-5 blur-[40px] transition-all" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-4">
                            <p className="text-slate-500 font-bold text-xs md:text-sm tracking-tight">{stat.label}</p>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">{stat.value}</h3>
                            <div className="space-y-1">
                                <p className="text-gold text-[10px] font-black uppercase tracking-[0.2em]">{stat.sub}</p>
                                <p className="text-slate-600 text-[9px] font-medium">{stat.trend}</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
