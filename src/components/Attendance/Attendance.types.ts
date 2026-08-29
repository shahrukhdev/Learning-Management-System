export type AttendanceStatus =
    | "present"
    | "late"
    | "absent"
    | "not-marked";

export interface Student {
    id: number;
    name: string;
    image: string;
}