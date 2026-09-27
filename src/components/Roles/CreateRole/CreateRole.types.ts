export interface RoleFormData {
    name: string;
    description: string;
}

export interface RolePermission {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}