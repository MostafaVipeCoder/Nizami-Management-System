import { AttendanceRecord, Employee, Transaction } from '../types';
import { isWithinInterval, parseISO, startOfDay, endOfDay, addMonths, subMonths, setDate } from 'date-fns';

/**
 * Gets the start and end dates for the accounting cycle (10th to 9th of next month).
 * For a given month string "YYYY-MM" (e.g., "2024-05"), the cycle starts on 2024-05-10
 * and ends on 2024-06-09.
 */
export const getCycleRange = (monthStr: string) => {
    const [year, month] = monthStr.split('-').map(Number);
    const startDate = new Date(year, month - 1, 10);
    const endDate = addMonths(startDate, 1);
    endDate.setDate(9);

    return {
        start: startOfDay(startDate),
        end: endOfDay(endDate)
    };
};

/**
 * Calculates total hours worked from a set of attendance records for a specific cycle.
 */
export const calculateTotalHours = (attendance: AttendanceRecord[], empId: string, monthStr: string): number => {
    const { start, end } = getCycleRange(monthStr);

    const cycleAttendance = attendance.filter((a) => {
        if (a.employeeId !== empId || !a.timeOut) return false;
        const recordDate = parseISO(a.date);
        return isWithinInterval(recordDate, { start, end });
    });

    return cycleAttendance.reduce((acc, curr) => {
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
 * Evaluates employee performance based on attendance percentage.
 */
export const evaluatePerformance = (hoursWorked: number, standardHours: number = 8) => {
    // Assuming 26 working days in a cycle
    const targetHours = standardHours * 24;
    const ratio = hoursWorked / targetHours;

    if (ratio >= 0.95) return { label: 'مثالي', color: 'text-green-600', bg: 'bg-green-50' };
    if (ratio >= 0.75) return { label: 'جيد', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (ratio >= 0.50) return { label: 'مقبول', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'متأخر', color: 'text-red-600', bg: 'bg-red-50' };
};

/**
 * Summarizes the payroll for an employee for a specific cycle.
 */
export const getEmployeePayrollSummary = (
    employee: Employee,
    attendance: AttendanceRecord[],
    transactions: Transaction[],
    monthStr: string
) => {
    const { start, end } = getCycleRange(monthStr);
    const totalHours = calculateTotalHours(attendance, employee.id, monthStr);

    const cycleTrans = transactions.filter((t) => {
        if (t.employeeId !== employee.id) return false;
        const transDate = parseISO(t.date);
        return isWithinInterval(transDate, { start, end });
    });

    const totalBonuses = cycleTrans
        .filter((t) => t.type === 'bonus')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalDeductions = cycleTrans
        .filter((t) => t.type === 'deduction' || t.type === 'penalty')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const hourlyRate = employee.dailyRate / (employee.standardHours || 8);
    const baseSalary = hourlyRate * totalHours;
    const netSalary = baseSalary + totalBonuses - totalDeductions;

    const performance = evaluatePerformance(totalHours, employee.standardHours);

    return {
        totalHours,
        baseSalary,
        totalBonuses,
        totalDeductions,
        netSalary,
        performance,
        transactions: cycleTrans,
    };
};
