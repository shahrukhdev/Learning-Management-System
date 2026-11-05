export interface Class {
    id: number;
    name: string;
    description: string;
    modules: number;
    color: string;
}

export const classes: Class[] = [
    {
        id: 1,
        name: "Beginner Quran",
        description: "Foundational Quran reading and recitation class.",
        modules: 4,
        color: "#4A5D23",
    },
    {
        id: 2,
        name: "Hifz Level 1",
        description: "Memorization class for students beginning Hifz.",
        modules: 3,
        color: "#C9E7A2",
    },
    {
        id: 3,
        name: "Arabic Fundamentals",
        description: "Introductory Arabic language and reading class.",
        modules: 2,
        color: "#E2E2C7",
    },
    {
        id: 4,
        name: "Tajweed Advanced",
        description: "Advanced rules of Quranic pronunciation and recitation.",
        modules: 5,
        color: "#D4D5C5",
    },
];
