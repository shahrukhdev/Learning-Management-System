import api from "../api/api";
import type { PaginationMeta } from "../types/api.types";
import type {
    PaginatedResult,
    ProgressCourse,
    ProgressRecordsParams,
    ProgressStudentItem,
    ProgressStudentsParams,
    ProgressSummary,
    StoreProgressRecordRequest,
    StoreProgressRecordResponse,
    UpdateProgressRecordRequest,
    StudentProgressDetails,
    StudentProgressRecord,
} from "../types/studentProgress.types";
import { DEFAULT_PROGRESS_GRADES } from "../types/studentProgress.types";

// Student Progress API. The Bearer token is attached by the api.ts request
// interceptor. Access (all students / a teacher's classes) is decided by the
// backend.

type RawObject = Record<string, unknown>;

const isObject = (value: unknown): value is RawObject =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const toNumber = (value: unknown): number | null => {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
};

const toText = (value: unknown): string | null =>
    typeof value === "string" ? value : typeof value === "number" ? String(value) : null;

const toList = <T>(value: unknown, map: (item: RawObject) => T | null): T[] =>
    Array.isArray(value)
        ? value.filter(isObject).map(map).filter((item): item is T => item !== null)
        : [];

const toPagination = (value: unknown): PaginationMeta | null => (isObject(value) ? (value as unknown as PaginationMeta) : null);

const toStudent = (item: RawObject): ProgressStudentItem | null => {
    const id = toNumber(item.id);

    if (id === null) return null;

    return {
        id,
        user_id: toNumber(item.user_id),
        name: toText(item.name) ?? "",
        initials: toText(item.initials) ?? "",
        email: toText(item.email) ?? "",
        image: toText(item.image) || null,
        admission_number: toText(item.admission_number) ?? "",
        class_id: toNumber(item.class_id),
        class_name: toText(item.class_name) ?? "",
        total_records: toNumber(item.total_records),
        last_progress_date: toText(item.last_progress_date),
        memorised_surahs: toNumber(item.memorised_surahs),
        total_surahs: toNumber(item.total_surahs),
        hifz_percentage: toNumber(item.hifz_percentage),
        attendance: toNumber(item.attendance),
        present: toNumber(item.present),
        late: toNumber(item.late),
        absent: toNumber(item.absent),
        total_attendance_days: toNumber(item.total_attendance_days),
    };
};

const toCourse = (item: RawObject): ProgressCourse | null => {
    const id = toNumber(item.id);

    if (id === null) return null;

    return { id, name: toText(item.name) ?? "", code: toText(item.code) ?? "" };
};

// Accepts a nested `course` / `recorded_by` object or flat fields
const toRecord = (item: RawObject): StudentProgressRecord | null => {
    const id = toNumber(item.id);

    if (id === null) return null;

    const course = isObject(item.course) ? item.course : null;
    const recordedBy = isObject(item.recorded_by) ? item.recorded_by : null;

    return {
        id,
        course_id: toNumber(course?.id ?? item.course_id),
        course_name: toText(course?.name) ?? toText(item.course_name) ?? toText(item.subject) ?? "",
        lesson: toText(item.lesson) ?? "",
        grade: toText(item.grade) ?? "",
        notes: toText(item.notes) || null,
        // The records API sends `date`; `progress_date` is accepted too
        progress_date: toText(item.date) ?? toText(item.progress_date),
        recorded_by_name: toText(recordedBy?.name) ?? toText(item.recorded_by_name) ?? "",
    };
};

const toSummary = (value: unknown): ProgressSummary => {
    const summary = isObject(value) ? value : {};

    return {
        total_records: toNumber(summary.total_records) ?? 0,
        strong_results: toNumber(summary.strong_results) ?? 0,
        needs_attention: toNumber(summary.needs_attention) ?? 0,
    };
};

// GET /v1/student-progress (10 per page by default)
export const getProgressStudents = async (
    params: ProgressStudentsParams,
    signal?: AbortSignal
): Promise<PaginatedResult<ProgressStudentItem>> => {

    const query: ProgressStudentsParams = {};

    if (params.search?.trim()) query.search = params.search.trim();
    if (params.academic_class_id !== undefined) query.academic_class_id = params.academic_class_id;
    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;

    const response = await api.get<RawObject>("/v1/student-progress", { params: query, signal });

    return {
        data: toList(response.data?.data, toStudent),
        pagination: toPagination(response.data?.pagination),
    };
};

// GET /v1/student-progress/{studentId}: profile, summary, subjects, grades
export const getStudentProgressDetails = async (
    studentId: number,
    signal?: AbortSignal
): Promise<StudentProgressDetails> => {

    const response = await api.get<RawObject>(`/v1/student-progress/${studentId}`, { signal });

    const data = isObject(response.data?.data) ? response.data.data : {};

    const student = isObject(data.student) ? toStudent(data.student) : null;

    if (!student) {
        throw new Error("Invalid student progress response.");
    }

    const grades = Array.isArray(data.grades)
        ? data.grades.filter((grade): grade is string => typeof grade === "string" && grade !== "")
        : [];

    return {
        student,
        summary: toSummary(data.summary),
        courses: toList(data.courses, toCourse),
        grades: grades.length > 0 ? grades : DEFAULT_PROGRESS_GRADES,
    };
};

// GET /v1/student-progress/{studentId}/records (latest first, 10 per page)
export const getStudentProgressRecords = async (
    studentId: number,
    params: ProgressRecordsParams,
    signal?: AbortSignal
): Promise<PaginatedResult<StudentProgressRecord>> => {

    const query: ProgressRecordsParams = {};

    if (params.course_id !== undefined) query.course_id = params.course_id;
    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;

    const response = await api.get<RawObject>(`/v1/student-progress/${studentId}/records`, {
        params: query,
        signal,
    });

    return {
        data: toList(response.data?.data, toRecord),
        pagination: toPagination(response.data?.pagination),
    };
};

// POST /v1/student-progress/{studentId}/records
export const storeStudentProgressRecord = async (
    studentId: number,
    payload: StoreProgressRecordRequest
): Promise<StoreProgressRecordResponse> => {

    const response = await api.post<RawObject>(`/v1/student-progress/${studentId}/records`, payload);

    return {
        message: toText(response.data?.message) ?? "",
        record: isObject(response.data?.data) ? toRecord(response.data.data) : null,
    };
};

// PUT /v1/student-progress/{studentId}/records/{recordId} (only the fields sent change)
export const updateStudentProgressRecord = async (
    studentId: number,
    recordId: number,
    payload: UpdateProgressRecordRequest
): Promise<StoreProgressRecordResponse> => {

    const response = await api.put<RawObject>(`/v1/student-progress/${studentId}/records/${recordId}`, payload);

    return {
        message: toText(response.data?.message) ?? "",
        record: isObject(response.data?.data) ? toRecord(response.data.data) : null,
    };
};

// DELETE /v1/student-progress/{studentId}/records/{recordId}
export const deleteStudentProgressRecord = async (studentId: number, recordId: number): Promise<{ message: string }> => {

    const response = await api.delete<RawObject>(`/v1/student-progress/${studentId}/records/${recordId}`);

    return { message: toText(response.data?.message) ?? "" };
};

/* ================================
   My Progress (signed-in student, read only). Same shapes as the
   per-student endpoints above, so the same parsers are used.
================================ */

export interface MyProgressDetails {
    student: ProgressStudentItem | null;
    summary: ProgressSummary;
    courses: ProgressCourse[];
}

// GET /v1/student-progress/my: profile, summary and subjects
export const getMyProgressDetails = async (signal?: AbortSignal): Promise<MyProgressDetails> => {

    const response = await api.get<RawObject>("/v1/student-progress/my", { signal });

    const data = isObject(response.data?.data) ? response.data.data : {};

    // `id` is null when the student has no student record yet: profile only
    const student = isObject(data.student)
        ? toStudent({ ...data.student, id: data.student.id ?? 0 })
        : null;

    return {
        student,
        summary: toSummary(data.summary),
        courses: toList(data.courses, toCourse),
    };
};

// GET /v1/student-progress/my/records (newest first, 10 per page)
export const getMyProgressRecords = async (
    params: ProgressRecordsParams,
    signal?: AbortSignal
): Promise<PaginatedResult<StudentProgressRecord>> => {

    const query: ProgressRecordsParams = {};

    if (params.course_id !== undefined) query.course_id = params.course_id;
    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;

    const response = await api.get<RawObject>("/v1/student-progress/my/records", { params: query, signal });

    return {
        data: toList(response.data?.data, toRecord),
        pagination: toPagination(response.data?.pagination),
    };
};
