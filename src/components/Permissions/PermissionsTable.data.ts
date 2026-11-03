export interface Permission {
    id: number;
    name: string;
    description: string;
    modules: number;
    color: string;
}

export const permissions: Permission[] = [
    {
        id: 1,
        name: "Manage Students",
        description: "View, create, edit, and manage student records.",
        modules: 4,
        color: "#4A5D23",
    },
    {
        id: 2,
        name: "Manage Academics",
        description: "Manage classes, syllabi, and academic calendars.",
        modules: 3,
        color: "#C9E7A2",
    },
    {
        id: 3,
        name: "Manage Attendance",
        description: "Record and review student attendance information.",
        modules: 2,
        color: "#E2E2C7",
    },
    {
        id: 4,
        name: "View Reports",
        description: "Access academic, attendance, and finance reports.",
        modules: 5,
        color: "#D4D5C5",
    },
];
