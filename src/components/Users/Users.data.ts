import DummyImg from "../../assets/images/student-dummy-img.png";

export type UserRole =
    | "Senior Teacher"
    | "Teacher"
    | "Registrar"
    | "Student"
    | "Admin";

export type UserStatus =
    | "active"
    | "inactive";

export interface UserManagementData {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    status: UserStatus;
    lastLogin: string;
    image?: string;
}

export const users: UserManagementData[] = [

    {
        id: 1,
        name: "Dr. Yusuf Ahmad",
        email: "yusuf.ahmad@madrasah.edu",
        role: "Senior Teacher",
        department: "Theology Dept.",
        status: "active",
        lastLogin: "Today, 08:42 AM",
        image: DummyImg,
    },

    {
        id: 2,
        name: "Fatima Zahra",
        email: "fatima.z@madrasah.edu",
        role: "Registrar",
        department: "Administration",
        status: "active",
        lastLogin: "Yesterday, 14:15 PM",
    },

    {
        id: 3,
        name: "Omar Malik",
        email: "omar.m@student.edu",
        role: "Student",
        department: "Year 4",
        status: "inactive",
        lastLogin: "Oct 12, 2023",
        image: DummyImg,
    },

    {
        id: 4,
        name: "Muhammad Ali",
        email: "muhammad.ali@madrasah.edu",
        role: "Student",
        department: "Year 3",
        status: "active",
        lastLogin: "Today, 09:15 AM",
    },

    {
        id: 5,
        name: "Ayesha Khan",
        email: "ayesha.k@madrasah.edu",
        role: "Teacher",
        department: "Quran Dept.",
        status: "active",
        lastLogin: "Today, 10:20 AM",
        image: DummyImg,
    },

    {
        id: 6,
        name: "Bilal Ahmed",
        email: "bilal.a@madrasah.edu",
        role: "Admin",
        department: "Administration",
        status: "active",
        lastLogin: "Yesterday, 11:30 AM",
    },

    {
        id: 7,
        name: "Hassan Raza",
        email: "hassan.r@madrasah.edu",
        role: "Student",
        department: "Year 2",
        status: "inactive",
        lastLogin: "Sep 10, 2023",
        image: DummyImg,
    },

    {
        id: 8,
        name: "Maryam Noor",
        email: "maryam.n@madrasah.edu",
        role: "Student",
        department: "Year 1",
        status: "active",
        lastLogin: "Today, 08:10 AM",
    },

    {
        id: 9,
        name: "Abdullah Saeed",
        email: "abdullah.s@madrasah.edu",
        role: "Senior Teacher",
        department: "Hifz Dept.",
        status: "active",
        lastLogin: "Today, 07:45 AM",
        image: DummyImg,
    },

    {
        id: 10,
        name: "Sara Ahmed",
        email: "sara.a@madrasah.edu",
        role: "Student",
        department: "Year 4",
        status: "active",
        lastLogin: "Yesterday, 16:20 PM",
    },

];