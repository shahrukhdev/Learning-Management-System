import type { PermissionListItem } from "../../../../types/permission.types";

// Permissions grouped by module (one matrix row per module)
export interface PermissionModuleGroup {
    key: string; // module ID, or "none" for permissions without a module
    name: string;
    permissions: PermissionListItem[];
}

const NO_MODULE_KEY = "none";

// Groups by `module_id` / nested `module`; modules A-Z, permissions A-Z,
// permissions without a module last
export const groupPermissionsByModule = (permissions: PermissionListItem[]): PermissionModuleGroup[] => {

    const groups = new Map<string, PermissionModuleGroup>();

    permissions.forEach((permission) => {
        const moduleId = permission.module?.id ?? permission.module_id ?? null;

        const key = moduleId !== null ? String(moduleId) : NO_MODULE_KEY;

        let group = groups.get(key);

        if (!group) {
            group = {
                key,
                name: permission.module?.name || (key === NO_MODULE_KEY ? "Other" : "Unnamed Module"),
                permissions: [],
            };
            groups.set(key, group);
        }

        group.permissions.push(permission);
    });

    const list = [...groups.values()];

    list.forEach((group) => group.permissions.sort((a, b) => a.name.localeCompare(b.name)));

    return list.sort((a, b) => {
        if (a.key === NO_MODULE_KEY) return 1;
        if (b.key === NO_MODULE_KEY) return -1;
        return a.name.localeCompare(b.name);
    });
};

// A role's assigned permissions (GET /v1/roles/{id} `permissions`) -> IDs.
// Accepts IDs, permission objects with an `id`, or permission names (names
// are matched against the loaded permissions). Duplicates are removed.
export const toRolePermissionIds = (
    rolePermissions: unknown[],
    allPermissions: PermissionListItem[]
): number[] => {

    const idsByName = new Map(allPermissions.map((permission) => [permission.name, permission.id]));

    const ids = new Set<number>();

    rolePermissions.forEach((item) => {
        if (typeof item === "number" && Number.isInteger(item)) {
            ids.add(item);
            return;
        }

        if (typeof item === "string") {
            const id = idsByName.get(item);
            if (id !== undefined) ids.add(id);
            return;
        }

        if (typeof item === "object" && item !== null) {
            const record = item as Record<string, unknown>;

            if (typeof record.id === "number") {
                ids.add(record.id);
            } else if (typeof record.name === "string") {
                const id = idsByName.get(record.name);
                if (id !== undefined) ids.add(id);
            }
        }
    });

    return [...ids];
};
