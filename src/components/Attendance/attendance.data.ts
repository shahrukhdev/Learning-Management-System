import avatorImg from "../../assets/images/student-dummy-img.png";

import type { Student } from "./attendance.types";

export const classOptions = [
    "Class A · Morning",
    "Class B · Evening",
    "Class C · Morning",
    "Class D · Evening",
];

export const students: Student[] = Array.from(
    { length: 35 },
    (_, index) => ({
        id: index + 1,
        name: "Muhammad Ali",
        image: avatorImg,
    })
);