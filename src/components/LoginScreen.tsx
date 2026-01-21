import React, { useState } from 'react';
import { ChevronLeft, Lock, Mail, User, Key, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNizamiStore } from '../store';
import { cn } from '../utils/cn';

interface LoginScreenProps {
    onBack: () => void;
    onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'register' | 'verify' | 'forgot' | 'reset';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onLoginSuccess }) => {
    const { registerUser, loginUser, verifyUser, resetPassword } = useNizamiStore();

    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    const generateCode = () => Math.floor(10000000 + Math.random() * 90000000).toString();

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMsg('');

        if (mode === 'login') {
            const err = loginUser(email, password);
            if (err) setError(err);
            else onLoginSuccess();
        } else if (mode === 'register') {
            const verificationCode = generateCode();
            registerUser({
                id: Math.random().toString(36).substr(2, 9),
                email,
                password,
                name,
                isVerified: false,
                verificationCode
            });
            console.log(`Verification code for ${email}: ${verificationCode}`);
            setMode('verify');
            setMsg('تم إرسال رمز التأكيد إلى بريدك الإلكتروني (تفقده في الكونسول)');
        } else if (mode === 'verify') {
            const success = verifyUser(email, code);
            if (success) {
                setMsg('تم تأكيد الحساب بنجاح! يمكنك الدخول الآن');
                setMode('login');
            } else {
                setError('الرمز غير صحيح');
            }
        } else if (mode === 'forgot') {
            setMode('reset');
            setMsg('قم بتعيين كلمة المرور الجديدة');
        } else if (mode === 'reset') {
            const success = resetPassword(email, password);
            if (success) {
                setMsg('تم تغيير كلمة المرور بنجاح');
                setMode('login');
            } else {
                setError('حدث خطأ ما');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
            <div className="w-full max-w-md animate-fadeIn">
                <button
                    onClick={onBack}
                    className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">العودة للرئيسية</span>
                </button>

                <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1.5 primary-bg opacity-40" />

                    <div className="text-center mb-10">
                        <div className="w-20 h-20 mx-auto mb-6 primary-bg rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-float">
                            {mode === 'login' && <Lock className="w-10 h-10 text-white" />}
                            {mode === 'register' && <User className="w-10 h-10 text-white" />}
                            {mode === 'verify' && <ShieldCheck className="w-10 h-10 text-white" />}
                            {(mode === 'forgot' || mode === 'reset') && <Key className="w-10 h-10 text-white" />}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            {mode === 'login' && 'تسجيل الدخول'}
                            {mode === 'register' && 'إنشاء حساب جديد'}
                            {mode === 'verify' && 'تأكيد الحساب'}
                            {mode === 'forgot' && 'نسيت كلمة المرور'}
                            {mode === 'reset' && 'تغيير كلمة المرور'}
                        </h2>
                        <p className="text-slate-400 font-bold text-[9px] tracking-[0.3em] uppercase mt-2">نظام نظامي - لإدارة الكافيهات</p>
                    </div>

                    <form onSubmit={handleAction} className="space-y-5">
                        {mode === 'register' && (
                            <div className="space-y-1">
                                <label className="text-slate-400 text-[9px] uppercase tracking-widest font-black pr-2">الاسم بالكامل</label>
                                <div className="relative">
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="محمد علي"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 pr-12 rounded-2xl focus:border-orange-500/30 outline-none font-bold transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {(mode !== 'verify' && mode !== 'reset') && (
                            <div className="space-y-1">
                                <label className="text-slate-400 text-[9px] uppercase tracking-widest font-black pr-2">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="admin@nizami.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 pr-12 rounded-2xl focus:border-orange-500/30 outline-none font-bold transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'verify' && (
                            <div className="space-y-1 text-center">
                                <label className="text-slate-400 text-[9px] uppercase tracking-widest font-black mb-4 block">رمز التأكيد (8 أرقام)</label>
                                <input
                                    required
                                    type="text"
                                    maxLength={8}
                                    placeholder="00000000"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 p-5 rounded-2xl focus:border-orange-500/30 outline-none text-center text-3xl tracking-[0.5em] font-black transition-all"
                                />
                            </div>
                        )}

                        {(mode === 'login' || mode === 'register' || mode === 'reset') && (
                            <div className="space-y-1">
                                <label className="text-slate-400 text-[9px] uppercase tracking-widest font-black pr-2">
                                    {mode === 'reset' ? 'كلمة المرور الجديدة' : 'كلمة المرور'}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 pr-12 rounded-2xl focus:border-orange-500/30 outline-none font-bold transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center text-[10px] font-black border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        {msg && (
                            <div className="bg-green-50 text-green-600 p-4 rounded-xl text-center text-[10px] font-black border border-green-100 flex items-center justify-center gap-2">
                                <CheckCircle size={14} />
                                {msg}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full primary-bg text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-orange-500/20"
                        >
                            {mode === 'login' && 'دخول'}
                            {mode === 'register' && 'إنشاء حساب'}
                            {mode === 'verify' && 'تأكيد'}
                            {mode === 'forgot' && 'إرسال الرمز'}
                            {mode === 'reset' && 'حفظ'}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col gap-3 text-center">
                        {mode === 'login' ? (
                            <>
                                <button onClick={() => setMode('register')} className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">ليس لديك حساب؟ <span className="text-orange-600">سجل الآن</span></button>
                                <button onClick={() => setMode('forgot')} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors italic line-through decoration-orange-200">نسيت كلمة المرور؟</button>
                                <button onClick={() => setMode('forgot')} className="text-xs font-bold text-orange-400 hover:text-orange-600 transition-colors">إعادة تعيين كلمة المرور</button>
                            </>
                        ) : (
                            <button onClick={() => { setMode('login'); setError(''); setMsg(''); }} className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">لديك حساب بالفعل؟ <span className="text-orange-600">تسجيل الدخول</span></button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
