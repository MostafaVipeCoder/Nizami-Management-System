import React from 'react';
import { Sparkles, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

interface LandingPageProps {
    onOwnerClick: () => void;
    onEmployeeClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOwnerClick, onEmployeeClick }) => {
    return (
        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
            {/* Header Badge */}
            <div className="animate-fadeIn opacity-0 [animation-delay:200ms] flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 backdrop-blur-md mb-8">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase gold-gradient">نظام الإدارة الاحترافي</span>
            </div>

            {/* Hero Section */}
            <div className="text-center space-y-4 mb-20">
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 animate-fadeIn opacity-0 [animation-delay:400ms]">
                    <span className="gold-gradient">نـظـامـي</span>
                    <span className="text-white">.</span>
                </h1>
                <p className="max-w-xl mx-auto text-slate-400 text-lg md:text-xl font-medium italic animate-fadeIn opacity-0 [animation-delay:600ms]">
                    "الحرفية في الإدارة، الفخامة في التجربة. نظام الحضور والرواتب الأكثر تطوراً."
                </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 animate-fadeIn opacity-0 [animation-delay:800ms]">
                {/* Owner Section */}
                <button
                    onClick={onOwnerClick}
                    className="group relative h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-[3rem] border border-gold/10 bg-[#0A0A0A] hover:border-gold/50 transition-all duration-700 hover:shadow-[0_0_80px_rgba(191,149,63,0.15)] overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold opacity-5 blur-[60px] group-hover:opacity-20 transition-opacity" />
                    <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                            <ShieldCheck className="w-10 h-10 text-gold" />
                        </div>
                        <h3 className="text-3xl font-black gold-gradient">قسم المشرف</h3>
                        <p className="text-slate-500 font-medium">التحكم الكامل في العمليات، التقارير المالية، وهيكلة الموظفين بأمان مطلق.</p>
                        <div className="flex items-center gap-2 mx-auto gold-gradient font-black uppercase text-xs tracking-widest pt-4">
                            <span>دخول لوحة التحكم</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </button>

                {/* Employee Section */}
                <button
                    onClick={onEmployeeClick}
                    className="group relative h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-[3rem] border border-white/5 bg-[#0A0A0A] hover:border-white/20 transition-all duration-700 hover:shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden"
                >
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-0 blur-[60px] group-hover:opacity-5 transition-opacity" />
                    <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl">
                            <Clock className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-3xl font-black text-white group-hover:text-gold transition-colors">بوابة الموظف</h3>
                        <p className="text-slate-500 font-medium">تسجيل حضور وانصراف سهل وسلس، يضمن الدقة في كل شفت عمل.</p>
                        <div className="flex items-center gap-2 mx-auto text-slate-500 group-hover:text-white font-black uppercase text-xs tracking-widest pt-4 transition-all">
                            <span>تسجيل الحضور</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </button>
            </div>

            {/* Footer */}
            <footer className="mt-32 w-full flex flex-col items-center gap-4 border-t border-white/5 pt-8">
                <div className="flex items-center gap-6 text-slate-700 font-black text-[10px] uppercase tracking-[0.5em]">
                    <span>تأسس عام ٢٠٢٤</span>
                    <div className="w-1 h-1 bg-gold rounded-full" />
                    <span>نظامي - الإصدار الاحترافي</span>
                </div>
            </footer>
        </main>
    );
};
