/**
 * Bloom — MMKV-backed Zustand store
 *
 * Holds: child profile, events, health data, tips, and memories.
 * Data persists locally using MMKV via Zustand middleware.
 */

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { type MMKV, createMMKV } from 'react-native-mmkv';

// ── MMKV instance ──────────────────────────────────
export const storage = createMMKV({ id: 'bloom-store' });

/** Zustand-compatible MMKV adapter */
const mmkvStorage: StateStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};

// ── Types ──────────────────────────────────────────
export interface ChildProfile {
  name: string;
  birthDate: string; // ISO 8601
  avatarUri?: string;
}

export interface TimelineEvent {
  id: string;
  time: string; // HH:mm
  title: string;
  icon: string; // emoji or icon name
  type: 'appointment' | 'medication' | 'milestone' | 'custom';
  done: boolean;
}

export interface GrowthEntry {
  date: string;
  weightKg?: number;
  heightCm?: number;
}

export interface VaccineRecord {
  id: string;
  name: string;
  dueDate: string;
  doneDate?: string;
}

export interface Memory {
  id: string;
  uri: string;
  date: string;
  caption?: string;
  type: 'photo' | 'video';
}

export interface BloomState {
  // ── Profile ────────────────────
  parentName: string;
  child: ChildProfile;
  setParentName: (name: string) => void;
  setChild: (child: ChildProfile) => void;

  // ── Dashboard ──────────────────
  todayEvents: TimelineEvent[];
  addEvent: (event: TimelineEvent) => void;
  toggleEvent: (id: string) => void;

  // ── Health ─────────────────────
  growthEntries: GrowthEntry[];
  addGrowthEntry: (entry: GrowthEntry) => void;
  vaccines: VaccineRecord[];
  addVaccine: (vaccine: VaccineRecord) => void;
  markVaccineDone: (id: string, date: string) => void;

  // ── Academy ────────────────────
  completedModules: string[];
  completeModule: (moduleId: string) => void;

  // ── Memories ───────────────────
  memories: Memory[];
  addMemory: (memory: Memory) => void;
}

// ── Store ──────────────────────────────────────────
export const useBloomStore = create<BloomState>()(
  persist(
    (set) => ({
      // ── Defaults ──
      parentName: 'Parent',
      child: {
        name: 'Leo',
        birthDate: '2023-11-15',
      },

      todayEvents: [
        {
          id: '1',
          time: '09:00',
          title: 'Vitamin D drops',
          icon: '💊',
          type: 'medication',
          done: false,
        },
        {
          id: '2',
          time: '14:00',
          title: 'Pediatrician check-up',
          icon: '🩺',
          type: 'appointment',
          done: false,
        },
        {
          id: '3',
          time: '16:30',
          title: 'Park time',
          icon: '🌳',
          type: 'custom',
          done: false,
        },
        {
          id: '4',
          time: '19:00',
          title: 'Evening bath & story',
          icon: '🛁',
          type: 'custom',
          done: false,
        },
      ],

      growthEntries: [
        { date: '2024-01-15', weightKg: 5.2, heightCm: 56 },
        { date: '2024-04-15', weightKg: 7.0, heightCm: 62 },
        { date: '2024-07-15', weightKg: 8.3, heightCm: 68 },
        { date: '2024-10-15', weightKg: 9.4, heightCm: 73 },
        { date: '2025-01-15', weightKg: 10.2, heightCm: 77 },
        { date: '2025-07-15', weightKg: 11.5, heightCm: 82 },
        { date: '2026-01-15', weightKg: 12.4, heightCm: 87 },
      ],

      vaccines: [
        { id: 'v1', name: 'BCG', dueDate: '2023-12-15', doneDate: '2023-12-16' },
        { id: 'v2', name: 'DTP – Dose 1', dueDate: '2024-01-15', doneDate: '2024-01-17' },
        { id: 'v3', name: 'DTP – Dose 2', dueDate: '2024-03-15', doneDate: '2024-03-20' },
        { id: 'v4', name: 'MMR – Dose 1', dueDate: '2024-11-15' },
        { id: 'v5', name: 'Hepatitis B – Dose 3', dueDate: '2025-05-15' },
      ],

      completedModules: ['sleep-basics', 'first-foods'],

      memories: [],

      // ── Actions ──
      setParentName: (name) => set({ parentName: name }),
      setChild: (child) => set({ child }),

      addEvent: (event) =>
        set((s) => ({ todayEvents: [...s.todayEvents, event] })),
      toggleEvent: (id) =>
        set((s) => ({
          todayEvents: s.todayEvents.map((e) =>
            e.id === id ? { ...e, done: !e.done } : e,
          ),
        })),

      addGrowthEntry: (entry) =>
        set((s) => ({ growthEntries: [...s.growthEntries, entry] })),
      addVaccine: (vaccine) =>
        set((s) => ({ vaccines: [...s.vaccines, vaccine] })),
      markVaccineDone: (id, date) =>
        set((s) => ({
          vaccines: s.vaccines.map((v) =>
            v.id === id ? { ...v, doneDate: date } : v,
          ),
        })),

      completeModule: (moduleId) =>
        set((s) => ({
          completedModules: [...new Set([...s.completedModules, moduleId])],
        })),

      addMemory: (memory) =>
        set((s) => ({ memories: [memory, ...s.memories] })),
    }),
    {
      name: 'bloom-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
