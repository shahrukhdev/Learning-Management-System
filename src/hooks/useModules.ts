import { useCallback, useEffect, useState } from "react";

import { clearModulesCache, loadModules } from "../services/moduleService";
import { parseApiError } from "../utils/apiError";
import type { ModuleItem } from "../types/module.types";

// Modules for dropdowns / lookups. Uses the shared cached request, so several
// components (or re-mounts) do not refetch.
export const useModules = () => {

    const [reloadToken, setReloadToken] = useState(0);

    const [state, setState] = useState<{
        token: number;
        modules: ModuleItem[];
        error: string | null;
    } | null>(null);

    useEffect(() => {
        let ignore = false;

        loadModules()
            .then((modules) => {
                if (!ignore) setState({ token: reloadToken, modules, error: null });
            })
            .catch((error: unknown) => {
                if (ignore) return;

                const { message } = parseApiError(error);

                setState({ token: reloadToken, modules: [], error: message });
            });

        return () => {
            ignore = true;
        };
    }, [reloadToken]);

    const retry = useCallback(() => {
        clearModulesCache();
        setReloadToken((token) => token + 1);
    }, []);

    const isCurrent = state?.token === reloadToken;

    return {
        modules: state?.modules ?? [],
        isLoading: !isCurrent,
        error: isCurrent ? state.error : null,
        retry,
    };
};
