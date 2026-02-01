import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, AttendanceRecord, Transaction, Settings, User } from './types';
import { supabase } from './lib/supabase';

interface NizamiStore {
    currentUser: User | null;
    employees: Employee[];
    attendance: AttendanceRecord[];
    transactions: Transaction[];
    settings: Settings;
    isLoading: boolean;

    // Actions
    initialize: () => Promise<void>;
    loginUser: (email: string, pass: string) => Promise<string | null>;
    registerUser: (email: string, pass: string, name: string) => Promise<string | null>;
    logoutUser: () => Promise<void>;

    // CRUD Actions
    fetchData: () => Promise<void>;

    addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
    updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>;
    deleteEmployee: (id: string) => Promise<void>;

    recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
    updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => Promise<void>;
    deleteAttendance: (id: string) => Promise<void>;

    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;

    updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

const defaultSettings: Settings = {
    morningShift: { start: '08:00', end: '16:00', duration: 8 },
    eveningShift: { start: '16:00', end: '00:00', duration: 8 }
};

export const useNizamiStore = create<NizamiStore>()(
    persist(
        (set, get) => ({
            currentUser: null,
            employees: [],
            attendance: [],
            transactions: [],
            settings: defaultSettings,
            isLoading: false,

            initialize: async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    set({
                        currentUser: {
                            id: session.user.id,
                            email: session.user.email!,
                            name: profile?.full_name || 'مستخدم',
                            isVerified: profile?.is_verified || false,
                            password: ''
                        }
                    });
                    await get().fetchData();
                } else {
                    // Force clear if no session is actually found in Supabase
                    set({ currentUser: null, employees: [], attendance: [], transactions: [] });
                }

                // Listen for auth changes
                supabase.auth.onAuthStateChange(async (event, session) => {
                    if (event === 'SIGNED_IN' && session?.user) {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();

                        set({
                            currentUser: {
                                id: session.user.id,
                                email: session.user.email!,
                                name: profile?.full_name || 'مستخدم',
                                isVerified: profile?.is_verified || false,
                                password: ''
                            }
                        });
                        await get().fetchData();
                    } else if (event === 'SIGNED_OUT') {
                        set({ currentUser: null, employees: [], attendance: [], transactions: [] });
                    }
                });
            },

            fetchData: async () => {
                const { currentUser } = get();
                if (!currentUser) return;

                set({ isLoading: true });

                try {
                    const [employeesRes, attendanceRes, transactionsRes, settingsRes] = await Promise.all([
                        supabase.from('nizami_employees').select('*'),
                        supabase.from('nizami_attendance').select('*'),
                        supabase.from('nizami_transactions').select('*'),
                        supabase.from('nizami_settings').select('*').single()
                    ]);

                    if (employeesRes.error) {
                        if (employeesRes.error.message.includes('Unauthorized') || employeesRes.error.code === '401' || employeesRes.error.code === 'PGRST301') {
                            set({ currentUser: null, isLoading: false });
                            return;
                        }
                    }

                    set({
                        employees: (employeesRes.data || []).map(e => ({
                            id: e.id,
                            name: e.name,
                            phone: e.phone,
                            dailyRate: Number(e.daily_rate),
                            standardHours: e.standard_hours,
                            isActive: e.is_active,
                            joinedDate: new Date(e.joined_date),
                            shift: e.shift
                        })),
                        attendance: (attendanceRes.data || []).map(a => ({
                            id: a.id,
                            employeeId: a.employee_id,
                            date: a.date,
                            timeIn: a.time_in,
                            timeOut: a.time_out,
                            totalHours: a.total_hours ? Number(a.total_hours) : undefined
                        })),
                        transactions: (transactionsRes.data || []).map(t => ({
                            id: t.id,
                            employeeId: t.employee_id,
                            amount: Number(t.amount),
                            type: t.type,
                            date: t.date,
                            note: t.note
                        })),
                        settings: settingsRes.data ? {
                            morningShift: {
                                start: settingsRes.data.morning_start,
                                end: settingsRes.data.morning_end,
                                duration: settingsRes.data.morning_duration
                            },
                            eveningShift: {
                                start: settingsRes.data.evening_start,
                                end: settingsRes.data.evening_end,
                                duration: settingsRes.data.evening_duration
                            }
                        } : defaultSettings,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                    set({ isLoading: false });
                }
            },

            loginUser: async (email, password) => {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) return error.message;
                return null;
            },

            registerUser: async (email, password, name) => {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: name } }
                });
                if (error) return error.message;
                return null;
            },

            logoutUser: async () => {
                await supabase.auth.signOut();
            },

            addEmployee: async (employee) => {
                const { currentUser } = get();
                if (!currentUser) return;

                const dbEmployee = {
                    name: employee.name,
                    phone: employee.phone,
                    daily_rate: employee.dailyRate,
                    standard_hours: employee.standardHours,
                    is_active: employee.isActive,
                    shift: employee.shift,
                    joined_date: employee.joinedDate.toISOString().split('T')[0],
                    owner_id: currentUser.id
                };
                const { error } = await supabase.from('nizami_employees').insert([dbEmployee]);
                if (!error) await get().fetchData();
                else console.error('Add employee error:', error);
            },

            updateEmployee: async (id, updates) => {
                const dbUpdates: any = {};
                if (updates.name) dbUpdates.name = updates.name;
                if (updates.phone) dbUpdates.phone = updates.phone;
                if (updates.dailyRate !== undefined) dbUpdates.daily_rate = updates.dailyRate;
                if (updates.standardHours !== undefined) dbUpdates.standard_hours = updates.standardHours;
                if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
                if (updates.shift) dbUpdates.shift = updates.shift;

                const { error } = await supabase.from('nizami_employees').update(dbUpdates).eq('id', id);
                if (!error) await get().fetchData();
            },

            deleteEmployee: async (id) => {
                const { error } = await supabase.from('nizami_employees').delete().eq('id', id);
                if (!error) await get().fetchData();
            },

            recordAttendance: async (record) => {
                const dbRecord = {
                    employee_id: record.employeeId,
                    date: record.date,
                    time_in: record.timeIn,
                    time_out: record.timeOut,
                    total_hours: record.totalHours
                };
                const { error } = await supabase.from('nizami_attendance').insert([dbRecord]);
                if (!error) await get().fetchData();
            },

            updateAttendance: async (id, updates) => {
                const dbUpdates: any = {};
                if (updates.timeOut) dbUpdates.time_out = updates.timeOut;
                if (updates.totalHours !== undefined) dbUpdates.total_hours = updates.totalHours;

                const { error } = await supabase.from('nizami_attendance').update(dbUpdates).eq('id', id);
                if (!error) await get().fetchData();
            },

            deleteAttendance: async (id) => {
                const { error } = await supabase.from('nizami_attendance').delete().eq('id', id);
                if (!error) await get().fetchData();
            },

            addTransaction: async (transaction) => {
                const dbTransaction = {
                    employee_id: transaction.employeeId,
                    amount: transaction.amount,
                    type: transaction.type,
                    date: transaction.date,
                    note: transaction.note
                };
                const { error } = await supabase.from('nizami_transactions').insert([dbTransaction]);
                if (!error) await get().fetchData();
            },

            deleteTransaction: async (id) => {
                const { error } = await supabase.from('nizami_transactions').delete().eq('id', id);
                if (!error) await get().fetchData();
            },

            updateSettings: async (updates) => {
                const { currentUser } = get();
                if (!currentUser) return;

                // Map frontend settings back to DB structure
                const dbUpdates: any = {};
                if (updates.morningShift) {
                    dbUpdates.morning_start = updates.morningShift.start;
                    dbUpdates.morning_end = updates.morningShift.end;
                    dbUpdates.morning_duration = updates.morningShift.duration;
                }
                if (updates.eveningShift) {
                    dbUpdates.evening_start = updates.eveningShift.start;
                    dbUpdates.evening_end = updates.eveningShift.end;
                    dbUpdates.evening_duration = updates.eveningShift.duration;
                }

                const { error } = await supabase.from('nizami_settings').update(dbUpdates).eq('owner_id', currentUser.id);
                if (!error) {
                    set((state) => ({ settings: { ...state.settings, ...updates } }));
                }
            },
        }),
        {
            name: 'nizami-storage',
            partialize: (state) => ({ currentUser: state.currentUser }), // Only persist currentUser
        }
    )
);

