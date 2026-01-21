import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Plus,
    Filter,
    Download,
    Wallet,
    Calculator,
    ShieldAlert,
    Search,
    User,
    Users,
    Calendar,
    X,
    PlusCircle
} from 'lucide-react';
import { useNizamiStore } from '../store';
import { cn } from '../utils/cn';
import { getEmployeePayrollSummary } from '../utils/payroll';

export const PayrollReport: React.FC = () => {
    const { employees, attendance, transactions, addTransaction, deleteTransaction } = useNizamiStore();
    const [activeMonth, setActiveMonth] = useState(new Date().toISOString().slice(0, 7));
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Advanced Filter States
    const [filterPerformance, setFilterPerformance] = useState<string>('all');
    const [filterShift, setFilterShift] = useState<string>('all');
    const [salaryRange, setSalaryRange] = useState({ min: 0, max: 50000 });

    const [showAddTransaction, setShowAddTransaction] = useState<string | null>(null);
    const [newTrans, setNewTrans] = useState({
        amount: 0,
        type: 'bonus' as 'bonus' | 'deduction',
        note: ''
    });

    // Filtering and calculation logic
    const payrollData = useMemo(() => {
        return employees.map(emp => {
            const summary = getEmployeePayrollSummary(emp, attendance, transactions, activeMonth);
            return {
                ...emp,
                summary
            };
        }).filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.includes(searchQuery);
            const matchesPerformance = filterPerformance === 'all' || item.summary.performance.label === filterPerformance;
            const matchesShift = filterShift === 'all' || item.shift === filterShift;
            const matchesSalary = item.summary.netSalary >= salaryRange.min && item.summary.netSalary <= salaryRange.max;

            return matchesSearch && matchesPerformance && matchesShift && matchesSalary;
        });
    }, [employees, attendance, transactions, activeMonth, searchQuery, filterPerformance, filterShift, salaryRange]);

    const resetFilters = () => {
        setFilterPerformance('all');
        setFilterShift('all');
        setSalaryRange({ min: 0, max: 50000 });
        setSearchQuery('');
    };

    const handleAddTransaction = (empId: string) => {
        if (newTrans.amount <= 0) return;
        addTransaction({
            id: Math.random().toString(36).substr(2, 9),
            employeeId: empId,
            amount: newTrans.amount,
            type: newTrans.type,
            date: new Date().toISOString().split('T')[0],
            note: newTrans.note
        });
        setNewTrans({ amount: 0, type: 'bonus', note: '' });
        setShowAddTransaction(null);
    };

    const totalPayout = payrollData.reduce((acc, curr) => acc + curr.summary.netSalary, 0);

    const exportToCSV = () => {
        const headers = ['الموظف', 'التقييم', 'اليومية', 'ساعات العمل', 'الراتب الأساسي', 'مكافآت', 'خصومات', 'الصافي'];
        const rows = payrollData.map(item => [
            item.name,
            item.summary.performance.label,
            item.dailyRate,
            item.summary.totalHours.toFixed(1),
            Math.round(item.summary.baseSalary),
            item.summary.totalBonuses,
            item.summary.totalDeductions,
            Math.round(item.summary.netSalary)
        ]);

        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `payroll_report_${activeMonth}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-fadeIn text-slate-900">
            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">إجمالي المنصرف المتوقع</p>
                        <h3 className="text-4xl font-black text-slate-900">
                            {totalPayout.toLocaleString('en-US').split('.')[0]}
                            <span className="text-sm font-bold text-orange-500 mr-2">ج.م</span>
                        </h3>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Wallet size={40} className="text-orange-500" />
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">عدد الموظفين</p>
                        <h3 className="text-4xl font-black text-slate-900">{payrollData.length}</h3>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Users size={40} className="text-blue-500" />
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">دورة الحساب (10 إلى 10)</p>
                        <div className="flex flex-col gap-2">
                            <input
                                type="month"
                                value={activeMonth}
                                onChange={(e) => setActiveMonth(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-black outline-none focus:border-orange-500/50"
                            />
                            <p className="text-[10px] text-orange-500 font-bold">من 10 الشهر الحالي إلى 10 الشهر القادم</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Calendar size={40} className="text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Main Table Interface */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="بحث بالاسم أو الكود..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pr-12 pl-4 text-slate-900 outline-none focus:border-orange-500/30 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2",
                                showFilters ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            )}
                        >
                            <Filter size={18} />
                            تصفية متقدمة
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl primary-bg text-white font-black text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            <Download size={18} />
                            تصدير Excel
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="p-8 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn text-right">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">تقييم الأداء</label>
                            <select
                                value={filterPerformance}
                                onChange={(e) => setFilterPerformance(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-500/50"
                            >
                                <option value="all">كل التقييمات</option>
                                <option value="مثالي">مثالي (Excellent)</option>
                                <option value="جيد">جيد (Good)</option>
                                <option value="متأخر">متأخر (Late)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الشفت (الفترة)</label>
                            <select
                                value={filterShift}
                                onChange={(e) => setFilterShift(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-500/50"
                            >
                                <option value="all">كل الفترات</option>
                                <option value="morning">صباحي (Morning)</option>
                                <option value="evening">مسائي (Evening)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">نطاق الراتب الصافي</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="أقل"
                                    value={salaryRange.min || ''}
                                    onChange={(e) => setSalaryRange({ ...salaryRange, min: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:border-orange-500/50"
                                />
                                <span className="text-slate-300">-</span>
                                <input
                                    type="number"
                                    placeholder="أعلى"
                                    value={salaryRange.max || ''}
                                    onChange={(e) => setSalaryRange({ ...salaryRange, max: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:border-orange-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={resetFilters}
                                className="w-full py-3 rounded-xl bg-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all"
                            >
                                إعادة تعيين
                            </button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-6">الموظف</th>
                                <th className="px-6 py-6">التقييم</th>
                                <th className="px-6 py-6">اليومية</th>
                                <th className="px-6 py-6">ساعات العمل</th>
                                <th className="px-6 py-6 text-blue-600">الراتب الأساسي</th>
                                <th className="px-6 py-6 text-green-600">مكافآت</th>
                                <th className="px-6 py-6 text-red-600">خصومات</th>
                                <th className="px-8 py-6 text-orange-600 bg-orange-50/30">الصافي</th>
                                <th className="px-8 py-6">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {payrollData.length > 0 ? (
                                payrollData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                    <span className="text-orange-500 font-black">{item.name[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{item.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">موظف</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={cn(
                                                "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                item.summary.performance.bg,
                                                item.summary.performance.color,
                                                `border-${item.summary.performance.color.split('-')[1]}-200`
                                            )}>
                                                {item.summary.performance.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-slate-500">{item.dailyRate}ج</td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-black text-xs">
                                                {item.summary.totalHours.toFixed(1)} س
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-black text-slate-900">{Math.round(item.summary.baseSalary).toLocaleString()}ج</td>
                                        <td className="px-6 py-5 text-green-600 font-black">+{item.summary.totalBonuses.toLocaleString()}ج</td>
                                        <td className="px-6 py-5 text-red-600 font-black">-{item.summary.totalDeductions.toLocaleString()}ج</td>
                                        <td className="px-8 py-5 bg-orange-50/20">
                                            <p className="text-lg font-black text-slate-900">{Math.round(item.summary.netSalary).toLocaleString()}ج</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => setShowAddTransaction(item.id)}
                                                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Search size={48} />
                                            <p className="font-black uppercase tracking-[0.2em] text-sm">لا توجد نتائج بحث</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showAddTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                    <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl animate-fadeIn relative">
                        <button
                            onClick={() => setShowAddTransaction(null)}
                            className="absolute top-6 left-6 text-slate-400 hover:text-slate-900"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <h4 className="text-2xl font-black text-slate-900 mb-2">إضافة عملية مالية</h4>
                            <p className="text-slate-400 text-sm">للموظف: <span className="text-orange-500 font-bold">{employees.find(e => e.id === showAddTransaction)?.name}</span></p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                <button
                                    onClick={() => setNewTrans({ ...newTrans, type: 'bonus' })}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                        newTrans.type === 'bonus' ? "bg-white text-green-600 shadow-sm border border-slate-200" : "text-slate-400"
                                    )}
                                >
                                    مكافأة
                                </button>
                                <button
                                    onClick={() => setNewTrans({ ...newTrans, type: 'deduction' })}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                        newTrans.type === 'deduction' ? "bg-white text-red-600 shadow-sm border border-slate-200" : "text-slate-400"
                                    )}
                                >
                                    خصم
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">المبلغ (ج.م)</label>
                                    <input
                                        type="number"
                                        value={newTrans.amount || ''}
                                        onChange={(e) => setNewTrans({ ...newTrans, amount: Number(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50 font-black"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">ملاحظات</label>
                                    <input
                                        type="text"
                                        placeholder="سبب المكافأة أو الخصم..."
                                        value={newTrans.note}
                                        onChange={(e) => setNewTrans({ ...newTrans, note: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => handleAddTransaction(showAddTransaction)}
                                className={cn(
                                    "w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95",
                                    newTrans.type === 'bonus' ? "bg-green-600 text-white shadow-green-500/20" : "bg-red-600 text-white shadow-red-500/20"
                                )}
                            >
                                تأكيد العملية
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
