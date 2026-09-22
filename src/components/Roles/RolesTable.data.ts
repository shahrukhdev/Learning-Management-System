export interface Role {
    id: number;
    name: string;
    description: string;
    users: number;
    color: string;
}

export const roles: Role[] = [
    {
        id: 1,
        name: "Super Administrator",
        description:
            "Full system access, configuration, and security management.",
        users: 3,
        color: "#4A5D23",
    },
    {
        id: 2,
        name: "Head Teacher",
        description:
            "Academic oversight, curriculum management, and staff supervision.",
        users: 12,
        color: "#C9E7A2",
    },
    {
        id: 3,
        name: "Instructor",
        description:
            "Classroom management, grading, and direct student interaction.",
        users: 45,
        color: "#E2E2C7",
    },
    {
        id: 4,
        name: "Parent Portal Access",
        description:
            "Read-only access to specific student records, attendance, and fees.",
        users: 320,
        color: "#D4D5C5",
    },
];