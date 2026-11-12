import type { PaginationMeta } from "./api.types";

// Student Progress API (/v1/student-progress)

// Grades accepted by the backend (ProgressGrade enum). The show endpoint
// returns the list; this is only the fallback when it is missing.
export const DEFAULT_PROGRESS_GRADES = ["A+", "A", "B+", "B", "C", "Needs Improvement"];

// A student in the Student Progress module (list card and profile)
export interface ProgressStudentItem {
    id: number;
    user_id: number | null;
    name: string;
    initials: string;
    email: string;
    image: string | null;
    admission_number: string;
    class_id: number | null;
    class_name: string;
    // Only in the list
    total_records: number | null;
    last_progress_date: string | null; // Y-m-d
}

export interface ProgressSummary {
    total_records: number;
    strong_results: number;
    needs_attention: number;
}

// A subject the student can be graded in (a course of their class)
export interface ProgressCourse {
    id: number;
    name: string;
    code: string;
}

export interface StudentProgressDetails {
    student: ProgressStudentItem;
    summary: ProgressSummary;
    courses: ProgressCourse[];
    grades: string[];
}

export interface StudentProgressRecord {
    id: number;
    course_id: number | null;
    course_name: string;
    lesson: string;
    grade: string;
    notes: string | null;
    progress_date: string | null; // Y-m-d
    recorded_by_name: string;
}

export interface ProgressStudentsParams {
    search?: string;
    academic_class_id?: number;
    page?: number;
    per_page?: number;
}

export interface ProgressRecordsParams {
    course_id?: number;
    page?: number;
    per_page?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: PaginationMeta | null;
}

export interface StoreProgressRecordRequest {
    course_id: number;
    lesson: string;
    grade: string;
    notes?: string | null;
    progress_date?: string; // Y-m-d, backend defaults to today
}

export interface StoreProgressRecordResponse {
    message: string;
    record: StudentProgressRecord | null;
}

export type ProgressRecordField = "course_id" | "lesson" | "grade" | "notes" | "progress_date";

export type ProgressRecordFormErrors = Partial<Record<ProgressRecordField, string>>;
