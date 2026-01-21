import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, AttendanceRecord, Transaction, Settings, User } from './types';

interface NizamiStore {
    users: User[];
    currentUser: User | null;
    employees: Employee[];
    attendance: AttendanceRecord[];
    transactions: Transaction[];
    settings: Settings;

    // Actions
    registerUser: (user: User) => void;
    loginUser: (email: string, pass: string) => string | null; // returns error message if any
    logoutUser: () => void;
    verifyUser: (email: string, code: string) => boolean;
    resetPassword: (email: string, newPass: string) => boolean;

    addEmployee: (employee: Employee) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;

    recordAttendance: (record: AttendanceRecord) => void;
    updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
    deleteAttendance: (id: string) => void;

    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;

    updateSettings: (updates: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
    morningShift: { start: '08:00', end: '16:00', duration: 8 },
    eveningShift: { start: '16:00', end: '00:00', duration: 8 }
};

export const useNizamiStore = create<NizamiStore>()(
    persist(
        (set, get) => ({
            users: [],
            currentUser: null,
            employees: [],
            attendance: [],
            transactions: [],
            settings: defaultSettings,

            registerUser: (user) =>
                set((state) => ({ users: [...state.users, user] })),

            loginUser: (email, pass) => {
                const user = get().users.find(u => u.email === email && u.password === pass);
                if (!user) return 'بيانات الدخول غير صحيحة';
                if (!user.isVerified) return 'الحساب لم يتم تأكيده بعد';
                set({ currentUser: user });
                return null;
            },

            logoutUser: () => set({ currentUser: null }),

            verifyUser: (email, code) => {
                const user = get().users.find(u => u.email === email && u.verificationCode === code);
                if (user) {
                    set((state) => ({
                        users: state.users.map(u => u.email === email ? { ...u, isVerified: true } : u)
                    }));
                    return true;
                }
                return false;
            },

            resetPassword: (email, newPass) => {
                const user = get().users.find(u => u.email === email);
                if (user) {
                    set((state) => ({
                        users: state.users.map(u => u.email === email ? { ...u, password: newPass } : u)
                    }));
                    return true;
                }
                return false;
            },

            addEmployee: (employee) =>
                set((state) => ({ employees: [...state.employees, employee] })),

            updateEmployee: (id, updates) =>
                set((state) => ({
                    employees: state.employees.map((e) => e.id === id ? { ...e, ...updates } : e)
                })),

            deleteEmployee: (id) =>
                set((state) => ({
                    employees: state.employees.filter((e) => e.id !== id)
                })),

            recordAttendance: (record) =>
                set((state) => ({ attendance: [...state.attendance, record] })),

            updateAttendance: (id, updates) =>
                set((state) => ({
                    attendance: state.attendance.map((a) => a.id === id ? { ...a, ...updates } : a)
                })),

            deleteAttendance: (id) =>
                set((state) => ({
                    attendance: state.attendance.filter((a) => a.id !== id)
                })),

            addTransaction: (transaction) =>
                set((state) => ({ transactions: [...state.transactions, transaction] })),

            deleteTransaction: (id) =>
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id)
                })),

            updateSettings: (updates) =>
                set((state) => ({ settings: { ...state.settings, ...updates } })),
        }),
        {
            name: 'nizami-storage',
        }
    )
);
