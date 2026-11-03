// Maps backend role names to the role-specific UI that exists today
export type DashboardRole = "admin" | "teacher";

const ROLE_MAP: Record<string, DashboardRole> = {
    "super admin": "admin",
    "admin": "admin",
    "teacher": "teacher",
};

// Returns null for roles without their own UI yet (e.g. Student, Parent)
export const getDashboardRole = (role: string | null | undefined): DashboardRole | null => {
    if (!role) return null;

    return ROLE_MAP[role.trim().toLowerCase()] ?? null;
};
