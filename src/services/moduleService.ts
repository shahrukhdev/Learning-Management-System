import api from "../api/api";
import type { ModuleItem, ModulesListResponse } from "../types/module.types";

// GET /v1/modules
export const getModules = async (signal?: AbortSignal): Promise<ModuleItem[]> => {
    const response = await api.get<ModulesListResponse>("/v1/modules", { signal });
    return Array.isArray(response.data.data) ? response.data.data : [];
};

// Modules rarely change, so they are fetched once and shared by the
// Permissions listing and the Create/Edit Permission pages. A failed request
// is not cached, so the next caller (or a retry) tries again.
let modulesRequest: Promise<ModuleItem[]> | null = null;

export const loadModules = (): Promise<ModuleItem[]> => {
    if (!modulesRequest) {
        modulesRequest = getModules().catch((error: unknown) => {
            modulesRequest = null;
            throw error;
        });
    }

    return modulesRequest;
};

// Forces the next loadModules() call to fetch again
export const clearModulesCache = (): void => {
    modulesRequest = null;
};
