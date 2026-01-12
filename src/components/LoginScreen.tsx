import React from 'react';
import { ChevronLeft, Lock } from 'lucide-react';

interface LoginScreenProps {
    password: string;
    setPassword: (password: string) => void;
    error: string;
    onLogin: (e: React.FormEvent) => void;
    onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
    password,
    setPassword,
    error,
    onLogin,
    onBack,
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-fadeIn">
                <button
                    onClick={onBack}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">العودة للرئيسية</span>
                </button>

                <div className="bg-[#0A0A0A] border border-gold/30 rounded-[3rem] p-12 shadow-2xl gold-glow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 gold-bg opacity-30" />

                    <div className="text-center mb-10">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gold rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(191,149,63,0.3)] animate-float">
                            <Lock className="w-10 h-10 text-black" />
                        </div>
                        <h2 className="text-3xl font-black gold-gradient uppercase tracking-tight">دخول المشرف</h2>
                        <p className="text-slate-500 font-bold text-[10px] tracking-[0.3em] uppercase mt-2">نظام الإدارة - نسخة المشرف</p>
                    </div>

                    <form onSubmit={onLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-slate-500 text-[10px] uppercase tracking-widest font-black block text-center">🔐 كلمة المرور المشفرة</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••"
                                className="w-full bg-[#111] border-2 border-gold/10 text-white p-5 rounded-2xl focus:border-gold/50 outline-none text-center text-2xl tracking-[1em] font-black transition-all"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full gold-bg text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(191,149,63,0.2)]"
                        >
                            تأكيد الدخول
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
