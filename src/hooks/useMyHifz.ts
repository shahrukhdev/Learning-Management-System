import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getMyHifz, getMyHifzSessions } from "../services/myHifzService";
import { parseApiError } from "../utils/apiError";
import type { MyHifz, MyHifzSessionsResult } from "../types/myHifz.types";

// The signed-in student's Hifz (read only). Same request pattern as the
// other hooks: one request per distinct query, older requests cancelled and
// results tagged with the query they belong to.

interface KeyedResult<T> {
    key: string;
    data: T | null;
    error: string | null;
}

const useKeyedRequest = <T,>(
    key: string,
    load: (signal: AbortSignal) => Promise<T>,
    toastId: string
) => {
    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<KeyedResult<T> | null>(null);

    const requestKey = `${key}|${reloadToken}`;

    useEffect(() => {
        const controller = new AbortController();

        load(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setResult({ key: requestKey, data, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                // 401 is handled by the api.ts interceptor (sign-out)
                if (status !== 401) toast.error(message, { toastId });

                setResult((previous) => ({ key: requestKey, data: previous?.data ?? null, error: message }));
            });

        return () => controller.abort();
        // `load` is rebuilt every render; the request key decides refetches
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestKey]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.key === requestKey;

    return {
        // While a new page loads, the previous data stays visible
        data: result?.data ?? null,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        hasLoaded: result !== null,
        retry,
    };
};

// GET /v1/my-hifz
export const useMyHifz = () => {
    const request = useKeyedRequest<MyHifz>("my-hifz", (signal) => getMyHifz(signal), "my-hifz-error");

    return {
        hifz: request.data,
        error: request.error,
        isLoading: request.isLoading,
        retry: request.retry,
    };
};

// GET /v1/my-hifz/sessions
export const useMyHifzSessions = ({ page, perPage }: { page: number; perPage: number }) => {
    const request = useKeyedRequest<MyHifzSessionsResult>(
        `sessions-${page}-${perPage}`,
        (signal) => getMyHifzSessions({ page, per_page: perPage }, signal),
        "my-hifz-sessions-error"
    );

    return {
        sessions: request.data?.sessions ?? [],
        pagination: request.data?.pagination ?? null,
        error: request.error,
        isLoading: request.isLoading,
        hasLoaded: request.hasLoaded,
        retry: request.retry,
    };
};
