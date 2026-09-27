export interface PermissionModule {
    id: string;
    name: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}


export const permissionModules: PermissionModule[] = [

    {
        id: "student-records",
        name: "Student Records",
        view: true,
        create: false,
        edit: true,
        delete: false,
    },

    {
        id: "curriculum-planning",
        name: "Curriculum Planning",
        view: true,
        create: true,
        edit: true,
        delete: false,
    },

    {
        id: "examination-grading",
        name: "Examination Grading",
        view: true,
        create: true,
        edit: true,
        delete: false,
    },

    {
        id: "disciplinary-logs",
        name: "Disciplinary Logs",
        view: true,
        create: false,
        edit: false,
        delete: false,
    },

    {
        id: "attendance-management",
        name: "Attendance Management",
        view: true,
        create: false,
        edit: false,
        delete: false,
    },

    {
        id: "transportation-management",
        name: "Transportation Management",
        view: true,
        create: false,
        edit: false,
        delete: false,
    },

    {
        id: "hostel-management",
        name: "Hostel Management",
        view: true,
        create: false,
        edit: false,
        delete: false,
    },

    {
        id: "library-management",
        name: "Library Management",
        view: true,
        create: false,
        edit: false,
        delete: false,
    },


];