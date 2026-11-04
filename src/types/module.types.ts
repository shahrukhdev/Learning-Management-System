// GET /v1/modules
export interface ModuleItem {
    id: number;
    name: string;
}

export interface ModulesListResponse {
    success: boolean;
    message: string;
    data: ModuleItem[];
}
