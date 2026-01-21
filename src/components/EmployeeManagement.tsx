import React, { useState } from 'react';
import {
    Plus,
    Search,
    MoreHorizontal,
    UserPlus,
    Trash2,
    Edit3,
    Phone,
    Banknote,
    Calendar,
    ShieldAlert,
    X,
    Sun,
    Moon,
    QrCode,
    ArrowUpRight,
    ArrowDownRight,
    History
} from 'lucide-react';
import { useNizamiStore } from '../store';
import { Employee } from '../types';
import { cn } from '../utils/cn';
import { QRCodeSVG } from 'qrcode.react';
import { getEmployeePayrollSummary } from '../utils/payroll';

export const EmployeeManagement: React.FC = () => {
    const {
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        attendance,
        transactions,
        deleteTransaction
    } = useNizamiStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showQrFor, setShowQrFor] = useState<Employee | null>(null);
    const [showDetailsFor, setShowDetailsFor] = useState<Employee | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'bonuses' | 'deductions'>('all');

    const [formData, setFormData] = useState<{
        name: string;
        phone: string;
        dailyRate: number;
        standardHours: number;
        shift: 'morning' | 'evening';
    }>({
        name: '',
        phone: '',
        dailyRate: 150,
        standardHours: 8,
        shift: 'morning'
    });

    const filtered = employees.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.phone.includes(searchTerm);
        if (!matchesSearch) return false;

        if (filterType === 'bonuses') {
            return transactions.some(t => t.employeeId === e.id && t.type === 'bonus');
        }
        if (filterType === 'deductions') {
            return transactions.some(t => t.employeeId === e.id && (t.type === 'deduction' || t.type === 'penalty'));
        }
        return true;
    });

    const openEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setFormData({
            name: emp.name,
            phone: emp.phone,
            dailyRate: emp.dailyRate,
            standardHours: emp.standardHours || 8,
            shift: emp.shift || 'morning'
        });
        setIsAdding(true);
    };

    const handleClose = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', phone: '', dailyRate: 150, standardHours: 8, shift: 'morning' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateEmployee(editingId, formData);
        } else {
            const id = Math.random().toString(36).substr(2, 9);
            addEmployee({
                id,
                ...formData,
                isActive: true,
                joinedDate: new Date(),
            });
        }
        handleClose();
    };

    return (
        <div className="space-y-8 px-4 md:px-0">
            {/* Sub-Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-4 w-full max-w-xl">
                    <div className="relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="البحث عن موظف بالاسم أو الهاتف..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 text-slate-900 focus:border-orange-500/30 outline-none transition-all shadow-sm"
                        />
                    </div>
                    {/* Financial Filters */}
                    <div className="flex p-1 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
                        <button
                            onClick={() => setFilterType('all')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                filterType === 'all' ? "primary-bg text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setFilterType('bonuses')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                filterType === 'bonuses' ? "bg-green-600 text-white shadow-md shadow-green-500/20" : "text-slate-400 hover:text-green-600"
                            )}
                        >
                            عليهم مكافآت
                        </button>
                        <button
                            onClick={() => setFilterType('deductions')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                filterType === 'deductions' ? "bg-red-600 text-white shadow-md shadow-red-500/20" : "text-slate-400 hover:text-red-600"
                            )}
                        >
                            لهم خصومات
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setIsAdding(true)}
                    className="primary-bg text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20 w-full md:w-auto self-end md:self-auto"
                >
                    <UserPlus size={20} />
                    <span>إضافة موظف جديد</span>
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto text-right">
                    <div className="w-full max-w-xl bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-fadeIn relative my-8">
                        <button onClick={handleClose} className="absolute top-6 left-6 text-slate-400 hover:text-slate-900 transition-colors">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl md:text-3xl font-black brand-gradient mb-8 text-center uppercase tracking-tight">
                            {editingId ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">الاسم الكامل</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="اكتب الاسم هنا..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">رقم الهاتف</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="01xxxxxxxxx"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">اليومية (جنيه)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.dailyRate}
                                            onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">فترة العمل (الشفت)</label>
                                        <select
                                            value={formData.shift}
                                            onChange={(e) => setFormData({ ...formData, shift: e.target.value as 'morning' | 'evening' })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50 appearance-none"
                                        >
                                            <option value="morning">صباحي</option>
                                            <option value="evening">مسائي</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">ساعات العمل (الشفت)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.standardHours}
                                            onChange={(e) => setFormData({ ...formData, standardHours: Number(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-orange-500/50"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full primary-bg text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                            >
                                {editingId ? 'حفظ التغييرات' : 'تسجيل الموظف'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Modal */}
            {showQrFor && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl animate-fadeIn relative text-center">
                        <button
                            onClick={() => setShowQrFor(null)}
                            className="absolute top-6 left-6 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{showQrFor.name}</h3>
                            <p className="text-slate-400 text-sm font-bold">امسح الكود لتسجيل الحضور</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center mb-8">
                            <QRCodeSVG
                                value={showQrFor.id}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        <button
                            onClick={() => window.print()}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
                        >
                            <QrCode size={20} />
                            طباعة الكود
                        </button>
                    </div>
                </div>
            )}

            {/* Employee Detail Modal */}
            {showDetailsFor && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl animate-fadeIn relative flex flex-col max-h-[90vh]">
                        <button
                            onClick={() => setShowDetailsFor(null)}
                            className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-10 pb-6 border-b border-slate-100 flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] primary-bg flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-orange-500/20">
                                {showDetailsFor.name[0]}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900">{showDetailsFor.name}</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">سجل الموظف الكامل</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-8">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-widest">
                                    <History size={16} className="text-orange-500" />
                                    الجدول الزمني (Timeline)
                                </h4>

                                <div className="space-y-4">
                                    {(() => {
                                        const summary = getEmployeePayrollSummary(
                                            showDetailsFor,
                                            attendance,
                                            transactions,
                                            new Date().toISOString().slice(0, 7)
                                        );

                                        const timeline = [
                                            ...attendance.filter(a => a.employeeId === showDetailsFor.id).map(a => ({ ...a, category: 'attendance' as const })),
                                            ...transactions.filter(t => t.employeeId === showDetailsFor.id).map(t => ({ ...t, category: 'transaction' as const }))
                                        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                                        return (
                                            <>
                                                <div className="flex items-center gap-3 mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                                    <div className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-sm", summary.performance.color)}>
                                                        تقييم الأداء: {summary.performance.label}
                                                    </div>
                                                    <p className="text-[10px] text-orange-600 font-bold">بناءً على الحضور في الشفتات المحددة</p>
                                                </div>

                                                <div className="space-y-0">
                                                    {timeline.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 group">
                                                            <div className="flex flex-col items-center">
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-110",
                                                                    item.category === 'attendance' ? "bg-blue-50 border-blue-100 text-blue-600" :
                                                                        (item as any).type === 'bonus' ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-600"
                                                                )}>
                                                                    {item.category === 'attendance' ? <ArrowUpRight size={18} /> :
                                                                        (item as any).type === 'bonus' ? <Plus size={18} /> : <Trash2 size={18} />}
                                                                </div>
                                                                {idx < timeline.length - 1 && <div className="w-px h-full bg-slate-100 mt-2" />}
                                                            </div>
                                                            <div className="pb-8 flex-1">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <p className="font-black text-slate-900">
                                                                        {item.category === 'attendance' ? 'تسجيل حضور وانصراف' :
                                                                            (item as any).type === 'bonus' ? 'مكافأة إضافية' : 'خصم مالي'}
                                                                    </p>
                                                                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase tracking-tight">
                                                                        {item.date}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-slate-500 font-medium">
                                                                    {item.category === 'attendance' ?
                                                                        `من ${(item as any).timeIn} إلى ${(item as any).timeOut || 'مستمر'}` :
                                                                        `${(item as any).amount} ج.م - ${(item as any).note || 'بدون ملاحظات'}`
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        );
                                    })()}

                                    {attendance.filter(a => a.employeeId === showDetailsFor.id).length === 0 &&
                                        transactions.filter(t => t.employeeId === showDetailsFor.id).length === 0 && (
                                            <p className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 font-bold italic">
                                                لا توجد حركات مسجلة لهذا الموظف
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 rounded-b-[3rem] flex justify-between items-center">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setShowDetailsFor(null); openEdit(showDetailsFor); }}
                                    className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    تعديل البيانات
                                </button>
                            </div>
                            <button
                                onClick={() => setShowDetailsFor(null)}
                                className="px-10 py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map((e) => (
                    <div key={e.id} className="group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden shadow-sm">
                        <button
                            onClick={() => setShowDetailsFor(e)}
                            className="w-20 h-20 shrink-0 rounded-3xl bg-orange-50 flex items-center justify-center border border-orange-100 relative z-10 transition-transform hover:rotate-6 active:scale-90"
                        >
                            <span className="text-3xl font-black text-orange-500">{e.name[0]}</span>
                        </button>

                        <div className="flex-1 relative z-10 w-full text-center sm:text-right">
                            <div className="flex justify-between items-start mb-4">
                                <button
                                    onClick={() => setShowDetailsFor(e)}
                                    className="text-xl md:text-2xl font-black text-slate-900 truncate max-w-[150px] md:max-w-none hover:text-orange-600 transition-colors"
                                >
                                    {e.name}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowQrFor(e)}
                                        className="p-2 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all group/qr"
                                        title="عرض كود QR"
                                    >
                                        <QrCode size={18} />
                                    </button>
                                    <button
                                        onClick={() => openEdit(e)}
                                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
                                                deleteEmployee(e.id);
                                            }
                                        }}
                                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-slate-500">
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Phone size={14} className="text-orange-400 shrink-0" />
                                    <span className="text-sm font-medium">{e.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Banknote size={14} className="text-orange-400 shrink-0" />
                                    <span className="text-sm font-medium">{e.dailyRate} ج / {e.standardHours || 8}س</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    {e.shift === 'evening' ? (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-100">
                                            <Moon size={10} className="text-blue-500" />
                                            <span className="text-[10px] font-black text-blue-600">مسائي</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-orange-50 border border-orange-100">
                                            <Sun size={10} className="text-orange-500" />
                                            <span className="text-[10px] font-black text-orange-600">صباحي</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start col-span-full">
                                    <Calendar size={14} className="text-orange-400 shrink-0" />
                                    <span className="text-sm font-medium">منذ {new Date(e.joinedDate).toLocaleDateString('ar-EG')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-0 group-hover:opacity-[0.03] blur-[40px] transition-all" />
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] md:rounded-[3rem] text-center flex flex-col items-center justify-center">
                        <ShieldAlert size={40} className="text-slate-300 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">لا يوجد موظفين في السجلات</p>
                    </div>
                )}
            </div>
        </div>
    );
};
