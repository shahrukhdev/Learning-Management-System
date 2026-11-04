export interface RoleFormData {
    name: string;
    description: string;
}

// Inline validation messages for the Role Information fields
export type RoleFormErrors = Partial<Record<keyof RoleFormData, string>>;

export interface RolePermission {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}