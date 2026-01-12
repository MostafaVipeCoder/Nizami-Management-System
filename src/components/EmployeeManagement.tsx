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
    X
} from 'lucide-react';
import { useNizamiStore } from '../store';
import { Employee } from '../types';
import { cn } from '../utils/cn';

export const EmployeeManagement: React.FC = () => {
    const { employees, addEmployee, updateEmployee, deleteEmployee } = useNizamiStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dailyRate: 150,
        standardHours: 8,
    });

    const filtered = employees.filter(e =>
        e.name.includes(searchTerm) || e.phone.includes(searchTerm)
    );

    const openEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setFormData({
            name: emp.name,
            phone: emp.phone,
            dailyRate: emp.dailyRate,
            standardHours: emp.standardHours || 8,
        });
        setIsAdding(true);
    };

    const handleClose = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', phone: '', dailyRate: 150, standardHours: 8 });
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
                <div className="relative w-full max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="البحث عن موظف بالاسم أو الهاتف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-gold/30 outline-none transition-all"
                    />
                </div>

                <button
                    onClick={() => setIsAdding(true)}
                    className="gold-bg text-black font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(191,149,63,0.2)] w-full md:w-auto"
                >
                    <UserPlus size={20} />
                    <span>إضافة موظف جديد</span>
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
                    <div className="w-full max-w-xl bg-[#0A0A0A] border border-gold/30 rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-fadeIn relative my-8">
                        <button onClick={handleClose} className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl md:text-3xl font-black gold-gradient mb-8 text-center uppercase tracking-tight">
                            {editingId ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pr-2">الاسم الكامل</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="اكتب الاسم هنا..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-gold/50"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pr-2">رقم الهاتف</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="01xxxxxxxxx"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-gold/50"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pr-2">اليومية (جنيه)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.dailyRate}
                                            onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-gold/50"
                                        />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pr-2">ساعات العمل في اليوم (الشفت)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.standardHours}
                                            onChange={(e) => setFormData({ ...formData, standardHours: Number(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-gold/50"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full gold-bg text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                            >
                                {editingId ? 'حفظ التغييرات' : 'تسجيل الموظف'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Employee Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map((e) => (
                    <div key={e.id} className="group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-gold/20 transition-all duration-500 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                        <div className="w-20 h-20 shrink-0 rounded-3xl bg-gold/10 flex items-center justify-center border border-gold/10 relative z-10">
                            <span className="text-3xl font-black text-gold">{e.name[0]}</span>
                        </div>

                        <div className="flex-1 relative z-10 w-full text-center sm:text-right">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-xl md:text-2xl font-black text-white truncate max-w-[150px] md:max-w-none">{e.name}</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(e)}
                                        className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
                                                deleteEmployee(e.id);
                                            }
                                        }}
                                        className="p-2 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-slate-500">
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Phone size={14} className="text-gold/50 shrink-0" />
                                    <span className="text-sm font-medium">{e.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Banknote size={14} className="text-gold/50 shrink-0" />
                                    <span className="text-sm font-medium">{e.dailyRate} ج / {e.standardHours || 8}س</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start col-span-full">
                                    <Calendar size={14} className="text-gold/50 shrink-0" />
                                    <span className="text-sm font-medium">منذ {new Date(e.joinedDate).toLocaleDateString('ar-EG')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold opacity-0 group-hover:opacity-[0.03] blur-[40px] transition-all" />
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-20 bg-white/5 border border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem] text-center flex flex-col items-center justify-center">
                        <ShieldAlert size={40} className="text-slate-700 mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">لا يوجد موظفين في السجلات</p>
                    </div>
                )}
            </div>
        </div>
    );
};
