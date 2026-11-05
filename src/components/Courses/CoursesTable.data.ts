export interface Course {
    id: number;
    name: string;
    description: string;
    lessons: number;
    color: string;
}

export const courses: Course[] = [
    {
        id: 1,
        name: "Quran Studies",
        description: "Structured Quran reading, recitation, and understanding course.",
        lessons: 12,
        color: "#4A5D23",
    },
    {
        id: 2,
        name: "Hifz Preparation",
        description: "Preparation course for students beginning Quran memorization.",
        lessons: 10,
        color: "#C9E7A2",
    },
    {
        id: 3,
        name: "Arabic Language",
        description: "Arabic vocabulary, grammar, and reading fundamentals.",
        lessons: 8,
        color: "#E2E2C7",
    },
    {
        id: 4,
        name: "Tajweed Rules",
        description: "Course covering the rules of accurate Quranic pronunciation.",
        lessons: 15,
        color: "#D4D5C5",
    },
];
