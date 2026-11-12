import type { ProgressStudent } from "../components/Popups/LogProgressPopup/LogProgressPopup";
import type { ProgressStudentItem } from "../types/studentProgress.types";

// "2026-07-28" -> "28 Jul 2026" (Student Progress dates); null when missing
// or invalid, so raw values are never shown
export const formatProgressDate = (date: string | null | undefined): string | null => {
    if (!date) return null;

    const parsedDate = new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00` : date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// Log Progress popup header data for a student
export const toPopupStudent = (student: ProgressStudentItem): ProgressStudent => ({
    id: student.id,
    name: student.name,
    email: student.email,
    className: student.class_name,
    initials: student.initials,
    image: student.image,
});

// Grade badge colour (existing classes)
export const getGradeClass = (grade: string) => {
    if (grade === "A+" || grade === "A") return "grade-high";
    if (grade === "B+" || grade === "B") return "grade-good";
    return "grade-review";
};
