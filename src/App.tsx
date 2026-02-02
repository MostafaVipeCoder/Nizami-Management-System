import React, { useState, useEffect } from 'react';
import { OwnerDashboard } from './components/OwnerDashboard';
import { EmployeePortal } from './components/EmployeePortal';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { useNizamiStore } from './store';

type ViewState = 'landing' | 'owner_login' | 'owner_dashboard' | 'employee_portal';

const App: React.FC = () => {
    const { currentUser, logoutUser } = useNizamiStore();
    const [view, setView] = useState<ViewState>('landing');

    // Auto-redirect to dashboard if logged in
    useEffect(() => {
        if (currentUser && view === 'owner_login') {
            setView('owner_dashboard');
        }
    }, [currentUser, view]);

    const handleLogout = () => {
        logoutUser();
        setView('landing');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-orange-600 selection:text-white">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500 opacity-[0.03] blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500 opacity-[0.03] blur-[120px] rounded-full animate-pulse delay-700" />
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
                    onLoginSuccess={() => setView('owner_dashboard')}
                    onBack={() => setView('landing')}
                />
            )}

            {view === 'owner_dashboard' && currentUser && (
                <OwnerDashboard
                    onLogout={handleLogout}
                    onSwitchToPortal={() => setView('employee_portal')}
                />
            )}

            {/* Fallback for dashboard access attempt without login */}
            {view === 'owner_dashboard' && !currentUser && (
                <LoginScreen
                    onLoginSuccess={() => setView('owner_dashboard')}
                    onBack={() => setView('landing')}
                />
            )}

            {view === 'employee_portal' && (
                <EmployeePortal onBack={() => currentUser ? setView('owner_dashboard') : setView('landing')} />
            )}
        </div>
    );
};

export default App;
