import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, AttendanceRecord, Transaction } from './types';

interface NizamiStore {
    employees: Employee[];
    attendance: AttendanceRecord[];
    transactions: Transaction[];

    // Actions
    addEmployee: (employee: Employee) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;

    recordAttendance: (record: AttendanceRecord) => void;
    updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;

    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
}

export const useNizamiStore = create<NizamiStore>()(
    persist(
        (set) => ({
            employees: [],
            attendance: [],
            transactions: [],

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

            addTransaction: (transaction) =>
                set((state) => ({ transactions: [...state.transactions, transaction] })),

            deleteTransaction: (id) =>
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id)
                })),
        }),
        {
            name: 'nizami-storage',
        }
    )
);
