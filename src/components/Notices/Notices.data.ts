import type { Notice } from "./Notices.types";

export const notices: Notice[] = [
    {
        id: 1,
        title: "Ramadan Schedule Change",
        description: "Effective from 10 Apr — all classes shift to evening timing (5:00 PM – 7:30 PM)",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        id: 2,
        title: "Hifz Exam – End of Month",
        description: "2026-04-28 • Covers Juz 1–3 for all Hifz levels",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        id: 3,
        title: "Parent–Teacher Evening",
        description: "2026-04-25 • 5:00 PM onward in the main hall",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        id: 4,
        title: "New Teacher Onboarding",
        description: "Sr. Ayesha joins Class B starting next week",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        id: 5,
        title: "Madrasah Closed – Public Holiday",
        description: "2026-04-14 • Resume classes 2026-04-15",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];