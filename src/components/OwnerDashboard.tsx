import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Clock,
    Wallet,
    Settings,
    LogOut,
    Bell,
    Plus,
    Crown,
    QrCode
} from 'lucide-react';
import { EmployeeManagement } from './EmployeeManagement';
import { AttendanceLog } from './AttendanceLog';
import { PayrollReport } from './PayrollReport';
import { SettingsPage } from './SettingsPage';
import { cn } from '../utils/cn';
import { useNizamiStore } from '../store';
import { getEmployeePayrollSummary } from '../utils/payroll';

interface OwnerDashboardProps {
    onLogout: () => void;
    onSwitchToPortal: () => void;
}

type Tab = 'overview' | 'employees' | 'attendance' | 'payroll' | 'settings';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout, onSwitchToPortal }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'نظرة عامة' },
        { id: 'employees', icon: Users, label: 'الموظفين' },
        { id: 'attendance', icon: Clock, label: 'الحضور' },
        { id: 'payroll', icon: Wallet, label: 'الرواتب' },
        { id: 'settings', icon: Settings, label: 'الإعدادات' },
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
            {/* Mobile Top Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 relative z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Crown className="text-white w-4 h-4" />
                    </div>
                    <h1 className="text-lg font-black brand-gradient tracking-tight">نظامي</h1>
                </div>
                <button
                    onClick={onLogout}
                    className="p-2 text-red-500 hover:bg-red-50/50 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                </button>
            </header>

            {/* Sidebar - Desktop Only */}
            <aside className="hidden md:flex w-80 border-l border-slate-200 bg-white flex-col relative z-20">
                <div className="p-8 pb-12">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Crown className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black brand-gradient tracking-tight">نـظـامـي</h1>
                            <p className="text-[8px] text-slate-400 uppercase font-black tracking-[0.3em]">لوحة التحكم الإدارية</p>
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
                                        ? "bg-orange-500/10 text-orange-600 shadow-[0_4px_12px_rgba(255,126,51,0.1)] border border-orange-500/10"
                                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-orange-500" : "group-hover:text-orange-500 transition-colors")} />
                                <div className="text-right">
                                    <p className="font-bold text-sm">{item.label}</p>
                                </div>
                            </button>
                        ))}

                        <div className="pt-8 mt-8 border-t border-slate-100">
                            <button
                                onClick={onSwitchToPortal}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all group"
                            >
                                <QrCode className="w-5 h-5" />
                                <div className="text-right">
                                    <p className="font-black text-xs uppercase tracking-widest">ماسح الحضور</p>
                                </div>
                            </button>
                        </div>
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-slate-100">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group"
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
                        <h2 className="text-4xl font-black text-slate-900 mb-2">
                            {navItems.find(i => i.id === activeTab)?.label}
                        </h2>
                        <p className="text-slate-400 font-medium">مرحباً بك في لوحة تحكم التميز الإداري.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-900">المشرف العام</p>
                                <p className="text-[9px] text-blue-600 uppercase font-black tracking-widest">إدارة النظام</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-600 shadow-lg shadow-blue-500/20 flex items-center justify-center">
                                <Crown className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:border-orange-200 transition-all shadow-sm">
                            <Bell className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </header>

                {/* Mobile Title with Logout */}
                <div className="md:hidden flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-slate-900">
                        {navItems.find(i => i.id === activeTab)?.label}
                    </h2>
                    <button
                        onClick={onLogout}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Dynamic Views */}
                <div className="animate-fadeIn">
                    {activeTab === 'overview' && <OverviewGrid />}
                    {activeTab === 'employees' && <EmployeeManagement />}
                    {activeTab === 'attendance' && <AttendanceLog />}
                    {activeTab === 'payroll' && <PayrollReport />}
                    {activeTab === 'settings' && <SettingsPage />}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white shadow-2xl border border-slate-200 p-2 rounded-2xl flex items-center justify-around z-30">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                            activeTab === item.id ? "text-orange-500 bg-orange-50" : "text-slate-400"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[8px] font-bold">{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={onSwitchToPortal}
                    className="flex flex-col items-center gap-1 text-orange-600 bg-orange-50 p-2 rounded-xl border border-orange-100"
                >
                    <QrCode className="w-5 h-5" />
                    <span className="text-[8px] font-bold">الماسح</span>
                </button>
            </nav>
        </div>
    );
};

const OverviewGrid = () => {
    const { employees, attendance, transactions } = useNizamiStore();

    const now = new Date();
    const currentMonthStr = now.getDate() < 10
        ? new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7)
        : now.toISOString().slice(0, 7);

    const today = now.toISOString().split('T')[0];

    // Real-time Workforce Stats
    const totalEmployeesCount = employees.length;
    const workingNowCount = attendance.filter(a => a.date === today && !a.timeOut).length;

    // Total payroll for the current active cycle
    const totalPayrollRaw = employees.reduce((acc, emp) => {
        const summary = getEmployeePayrollSummary(emp, attendance, transactions, currentMonthStr);
        return acc + summary.netSalary;
    }, 0);
    const totalPayroll = Math.round(totalPayrollRaw);

    const stats = [
        {
            label: 'القوى العاملة',
            value: `${workingNowCount}/${totalEmployeesCount}`,
            sub: 'موظف نشط حالياً',
            icon: Users,
            trend: `الإجمالي: ${totalEmployeesCount}`,
            color: 'orange'
        },
        {
            label: 'حالة الالتزام اليومي',
            value: (totalEmployeesCount - workingNowCount).toString(),
            sub: 'لم يسجلوا حضور اليوم',
            icon: Clock,
            trend: 'بانتظار اكتمال الفريق',
            color: 'blue'
        },
        {
            label: 'إجمالي رواتب الشهر',
            value: totalPayroll.toLocaleString('en-US').split('.')[0],
            sub: 'جنيه مصري (صافي)',
            icon: Wallet,
            trend: 'حسب الساعات المسجلة',
            color: 'green'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, i) => (
                <div key={i} className="group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 hover:border-orange-200 transition-all duration-500 relative overflow-hidden shadow-xl shadow-slate-200/50">
                    <div className={cn(
                        "absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-5 blur-[40px] transition-all",
                        stat.color === 'orange' ? "bg-orange-500" : stat.color === 'blue' ? "bg-blue-500" : "bg-green-500"
                    )} />
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-4">
                            <p className="text-slate-400 font-bold text-xs md:text-sm tracking-tight">{stat.label}</p>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">{stat.value}</h3>
                            <div className="space-y-1">
                                <p className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em]",
                                    stat.color === 'orange' ? "text-orange-500" : stat.color === 'blue' ? "text-blue-500" : "text-green-600"
                                )}>{stat.sub}</p>
                                <p className="text-slate-400 text-[9px] font-medium">{stat.trend}</p>
                            </div>
                        </div>
                        <div className={cn(
                            "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border transition-colors",
                            stat.color === 'orange' ? "bg-orange-50 border-orange-100 text-orange-500" :
                                stat.color === 'blue' ? "bg-blue-50 border-blue-100 text-blue-500" :
                                    "bg-green-50 border-green-100 text-green-600"
                        )}>
                            <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
