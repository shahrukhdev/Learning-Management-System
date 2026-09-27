import DummyImage from "../../../../assets/images/student-dummy-img.png";


export interface Personnel {
    id: number;
    name: string;
    department: string;
    image?: string;
}


/* =========================
   Currently Assigned
========================= */

export const assignedPersonnel: Personnel[] = [

    {
        id: 1,
        name: "Amina Rahman",
        department: "Department Head, Sciences",
        image: DummyImage,
    },

    {
        id: 2,
        name: "Yusuf Hassan",
        department: "Senior Lecturer, Islamic Studies",
    },

    {
        id: 3,
        name: "Omar Farooq",
        department: "Lead Instructor, Mathematics",
        image: DummyImage,
    },

];


/* =========================
   Available Staff
========================= */

export const availablePersonnel: Personnel[] = [

    {
        id: 4,
        name: "Fatima Ali",
        department: "Teacher, Languages",
    },

    {
        id: 5,
        name: "Bilal Malik",
        department: "Assistant Teacher, Sciences",
        image: DummyImage,
    },

    {
        id: 6,
        name: "Zainab Khan",
        department: "Admin Assistant",
    },

];