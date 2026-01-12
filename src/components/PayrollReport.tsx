import React, { useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Plus,
    Filter,
    Download,
    Wallet,
    Calculator,
    Crown,
    Banknote,
    Trash2,
    History as HistoryIcon
} from 'lucide-react';
import { useNizamiStore } from '../store';
import { cn } from '../utils/cn';
import { getEmployeePayrollSummary } from '../utils/payroll';

export const PayrollReport: React.FC = () => {
    const { employees, attendance, transactions, addTransaction, deleteTransaction } = useNizamiStore();
    const [activeMonth, setActiveMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [selectedEmpId, setSelectedEmpId] = useState<string | null>(employees[0]?.id || null);

    const [showAddTransaction, setShowAddTransaction] = useState<string | null>(null);
    const [newTrans, setNewTrans] = useState({
        amount: 0,
        type: 'bonus' as 'bonus' | 'deduction',
        note: ''
    });

    const handleAddTransaction = (e: React.FormEvent, empId: string) => {
        e.preventDefault();
        addTransaction({
            id: Math.random().toString(36).substr(2, 9),
            employeeId: empId,
            amount: newTrans.amount,
            type: newTrans.type,
            date: new Date().toISOString().split('T')[0],
            note: newTrans.note
        });
        setShowAddTransaction(null);
        setNewTrans({ amount: 0, type: 'bonus', note: '' });
    };

    const selectedEmp = employees.find(e => e.id === selectedEmpId);
    const summary = selectedEmp ? getEmployeePayrollSummary(selectedEmp, attendance, transactions, activeMonth) : null;

    return (
        <div className="space-y-8 animate-fadeIn px-2 md:px-0">
            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 bg-[#0A0A0A] border border-white/5 p-2 rounded-[1.5rem] w-full md:w-auto shadow-2xl">
                    {/* Month Picker */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                        <Calculator size={14} className="text-slate-500" />
                        <input
                            type="month"
                            value={activeMonth}
                            onChange={(e) => setActiveMonth(e.target.value)}
                            className="bg-transparent text-gold font-black uppercase tracking-widest outline-none text-xs"
                        />
                    </div>

                    <div className="hidden md:block w-[1px] h-8 bg-white/10" />

                    {/* Employee Dropdown */}
                    <div className="flex-1 min-w-[200px] flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                        <Filter size={14} className="text-slate-500" />
                        <select
                            value={selectedEmpId || ''}
                            onChange={(e) => setSelectedEmpId(e.target.value)}
                            className="bg-transparent text-white font-bold outline-none flex-1 appearance-none cursor-pointer"
                        >
                            <option value="" disabled className="bg-[#0A0A0A]">اختر موظفاً...</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id} className="bg-[#0A0A0A]">
                                    {e.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-gold/30 rounded-2xl text-white transition-all shadow-xl group w-full md:w-auto">
                    <Download size={20} className="text-gold group-hover:-translate-y-1 transition-transform" />
                    <span className="font-black text-xs uppercase tracking-widest">تحميل التقرير</span>
                </button>
            </div>

            {selectedEmp && summary ? (
                <div key={selectedEmp.id} className="rounded-[2.5rem] md:rounded-[3rem] bg-[#0A0A0A] border border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className="flex flex-col xl:flex-row">
                        {/* Left Section: Employee & Large Pay Figure */}
                        <div className="p-8 md:p-12 xl:w-[400px] border-b xl:border-b-0 xl:border-l border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center font-black text-2xl text-gold shadow-2xl">
                                    {selectedEmp.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white">{selectedEmp.name}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">عضو فريق العمل</p>
                                </div>
                            </div>

                            <div className="relative p-8 rounded-[2rem] bg-gold/5 border border-gold/10 overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] text-gold font-black uppercase tracking-[0.3em] mb-3">إجمالي المستحقات (حالي)</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-5xl font-black text-white leading-none tracking-tighter">
                                            {Math.round(summary.netSalary).toLocaleString()}
                                        </h3>
                                        <span className="text-sm font-black text-slate-500">جنيه</span>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2">
                                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gold animate-shimmer" style={{ width: '100%' }} />
                                        </div>
                                        <span className="text-[9px] font-black text-gold/50 uppercase tracking-widest">جاري التنفيذ</span>
                                    </div>
                                </div>
                                <Wallet className="absolute -bottom-4 -right-4 w-24 h-24 text-gold/5 rotate-12" />
                            </div>

                            <button
                                onClick={() => setShowAddTransaction(selectedEmp.id)}
                                className="w-full mt-8 py-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest group/btn"
                            >
                                <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
                                <span>إضافة معاملة مالية</span>
                            </button>
                        </div>

                        {/* Right Section: Detailed Stats & Transactions */}
                        <div className="flex-1 flex flex-col">
                            {/* Detailed Calculation Legend */}
                            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                                <p className="text-[10px] text-slate-500 font-bold mb-0 text-center">
                                    معادلة الحساب: ( {summary.totalHours.toFixed(1)} س عمل / {selectedEmp.standardHours || 8} س شفت ) × {selectedEmp.dailyRate} جنيه يومية = {Math.round(summary.baseSalary)} جنيه أساسي
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-white/5">
                                {[
                                    { label: 'ساعات العمل', value: `${summary.totalHours.toFixed(1)} س`, icon: Calculator, color: 'text-blue-400' },
                                    { label: 'الراتب الأساسي', value: `${Math.round(summary.baseSalary)} ج`, icon: Banknote, color: 'text-slate-400' },
                                    { label: 'إجمالي المكافآت', value: `+${summary.totalBonuses} ج`, icon: TrendingUp, color: 'text-green-400' },
                                    { label: 'إجمالي الخصومات', value: `-${summary.totalDeductions} ج`, icon: TrendingDown, color: 'text-red-400' },
                                ].map((stat, i) => (
                                    <div key={i} className={cn(
                                        "p-6 md:p-8 flex flex-col justify-center gap-2",
                                        i < 3 ? "border-l border-white/5" : ""
                                    )}>
                                        <div className="flex items-center gap-2">
                                            <stat.icon size={14} className={stat.color} />
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                                        </div>
                                        <p className={cn(
                                            "text-xl md:text-2xl font-black",
                                            i === 1 ? "text-white" : stat.color
                                        )}>
                                            {stat.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Transactions List */}
                            <div className="p-8 bg-black/20 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">سجل المعاملات / {activeMonth}</p>
                                    <HistoryIcon size={14} className="text-slate-700" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                                    {summary.transactions.length > 0 ? (
                                        summary.transactions.map(t => (
                                            <div key={t.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex justify-between items-center group/item hover:border-gold/20 transition-all">
                                                <div className="min-w-0 pr-4">
                                                    <p className="text-sm font-bold text-white truncate">{t.note}</p>
                                                    <p className="text-[10px] text-slate-600 font-medium">{t.date}</p>
                                                </div>
                                                <div className="flex items-center gap-4 shrink-0">
                                                    <span className={cn(
                                                        "text-sm font-black",
                                                        t.type === 'bonus' ? "text-green-500" : "text-red-500"
                                                    )}>
                                                        {t.type === 'bonus' ? '+' : '-'}{t.amount}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteTransaction(t.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-700 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-700 opacity-30">
                                            <Wallet size={32} className="mb-2" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">لا توجد سجلات مالية</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal for adding transaction */}
                    {showAddTransaction === selectedEmp.id && (
                        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
                            <div className="w-full max-w-sm space-y-8">
                                <div className="text-center">
                                    <h5 className="text-3xl font-black text-white mb-2">تعديل مالي</h5>
                                    <p className="text-gold text-xs font-black uppercase tracking-[0.2em]">للموظف: {selectedEmp.name}</p>
                                </div>

                                <form onSubmit={(e) => handleAddTransaction(e, selectedEmp.id!)} className="space-y-4">
                                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                                        {(['bonus', 'deduction'] as const).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewTrans({ ...newTrans, type })}
                                                className={cn(
                                                    "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    newTrans.type === type ? "bg-gold text-black shadow-lg" : "text-slate-500 hover:text-white"
                                                )}
                                            >
                                                {type === 'bonus' ? 'مكافأة' : 'خصم / سلفة'}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            required
                                            type="number"
                                            placeholder="المبلغ (جنيه)"
                                            value={newTrans.amount || ''}
                                            onChange={(e) => setNewTrans({ ...newTrans, amount: Number(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white text-center text-3xl font-black outline-none focus:border-gold transition-all"
                                        />
                                        <input
                                            required
                                            type="text"
                                            placeholder="اكتب السبب هنا..."
                                            value={newTrans.note}
                                            onChange={(e) => setNewTrans({ ...newTrans, note: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="submit" className="flex-1 gold-bg text-black py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl">تأكيد العملية</button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddTransaction(null)}
                                            className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all font-bold"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-0 left-0 w-64 h-64 bg-gold opacity-[0.03] blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            ) : (
                <div className="py-40 text-center flex flex-col items-center opacity-30">
                    <Crown size={64} className="mb-6" />
                    <h3 className="text-2xl font-black uppercase tracking-[0.5em] text-slate-500">
                        {employees.length === 0 ? 'لا يوجد موظفين مسجلين' : 'يرجى اختيار موظف لعرض التقرير'}
                    </h3>
                </div>
            )}
        </div>
    );
};
