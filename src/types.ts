export type UserRole = 'owner' | 'employee';

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    isVerified: boolean;
    verificationCode?: string;
}

export interface Employee {
    id: string;
    name: string;
    phone: string;
    dailyRate: number;
    standardHours: number; // e.g., 8
    isActive: boolean;
    joinedDate: Date;
    shift: 'morning' | 'evening';
}

export interface ShiftSettings {
    start: string; // HH:mm
    end: string;   // HH:mm
    duration: number;
}

export interface Settings {
    morningShift: ShiftSettings;
    eveningShift: ShiftSettings;
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string; // YYYY-MM-DD
    timeIn: string; // ISO string or HH:mm
    timeOut?: string;
    totalHours?: number;
}

export type TransactionType = 'bonus' | 'deduction' | 'penalty';

export interface Transaction {
    id: string;
    employeeId: string;
    amount: number;
    type: TransactionType;
    date: string;
    note: string;
}

export interface PayrollReport {
    employeeId: string;
    employeeName: string;
    period: string; // e.g., "2024-01"
    totalHours: number;
    baseSalary: number;
    totalBonuses: number;
    totalDeductions: number;
    netSalary: number;
}
