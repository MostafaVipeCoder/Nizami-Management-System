import { AttendanceRecord, Employee, Transaction } from '../types';

/**
 * Calculates total hours worked from a set of attendance records for a specific month.
 */
export const calculateTotalHours = (attendance: AttendanceRecord[], empId: string, month: string): number => {
    const monthAttendance = attendance.filter(
        (a) => a.employeeId === empId && a.date.startsWith(month) && a.timeOut
    );

    return monthAttendance.reduce((acc, curr) => {
        const hours = calculateHoursNumber(curr.timeIn, curr.timeOut!);
        return acc + hours;
    }, 0);
};

const parseTime = (timeStr: string) => {
    const standardized = timeStr.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    const parts = standardized.split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return { h, m };
};

export const calculateHoursNumber = (inStr: string, outStr: string): number => {
    if (!outStr) return 0;

    const t1 = parseTime(inStr);
    const t2 = parseTime(outStr);

    let totalMin = (t2.h * 60 + t2.m) - (t1.h * 60 + t1.m);

    if (totalMin < 0) {
        totalMin += 24 * 60;
    }

    return totalMin / 60;
};

/**
 * Summarizes the payroll for an employee for a specific month.
 */
export const getEmployeePayrollSummary = (
    employee: Employee,
    attendance: AttendanceRecord[],
    transactions: Transaction[],
    month: string
) => {
    const totalHours = calculateTotalHours(attendance, employee.id, month);

    const monthTrans = transactions.filter(
        (t) => t.employeeId === employee.id && t.date.startsWith(month)
    );

    const totalBonuses = monthTrans
        .filter((t) => t.type === 'bonus')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalDeductions = monthTrans
        .filter((t) => t.type === 'deduction' || t.type === 'penalty')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const hourlyRate = employee.dailyRate / (employee.standardHours || 8);
    const baseSalary = hourlyRate * totalHours;
    const netSalary = baseSalary + totalBonuses - totalDeductions;

    return {
        totalHours,
        baseSalary,
        totalBonuses,
        totalDeductions,
        netSalary,
        transactions: monthTrans,
    };
};
