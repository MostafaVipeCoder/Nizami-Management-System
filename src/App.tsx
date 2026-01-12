import React, { useState } from 'react';
import { OwnerDashboard } from './components/OwnerDashboard';
import { EmployeePortal } from './components/EmployeePortal';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';

type ViewState = 'landing' | 'owner_login' | 'owner_dashboard' | 'employee_portal';

const App: React.FC = () => {
    const [view, setView] = useState<ViewState>('landing');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [, setIsAdmin] = useState(false);

    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '225599';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setView('owner_dashboard');
            setError('');
        } else {
            setError('كلمة المرور غلط - ممنوع الدخول');
        }
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setView('landing');
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-gold-dark selection:text-white">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold opacity-10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gold-dark opacity-10 blur-[120px] rounded-full animate-pulse delay-700" />
            </div>

            {/* View Controller */}
            {view === 'landing' && (
                <LandingPage
                    onOwnerClick={() => setView('owner_login')}
                    onEmployeeClick={() => setView('employee_portal')}
                />
            )}

            {view === 'owner_login' && (
                <LoginScreen
                    password={password}
                    setPassword={setPassword}
                    error={error}
                    onLogin={handleLogin}
                    onBack={() => setView('landing')}
                />
            )}

            {view === 'owner_dashboard' && <OwnerDashboard onLogout={handleLogout} />}
            {view === 'employee_portal' && <EmployeePortal onBack={() => setView('landing')} />}
        </div>
    );
};

export default App;
