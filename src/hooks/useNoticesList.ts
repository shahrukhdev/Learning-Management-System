import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getNotices } from "../services/noticeService";
import { parseApiError } from "../utils/apiError";
import type { PaginationMeta } from "../types/api.types";
import type { NoticeItem } from "../types/notice.types";

// Same request pattern as the Roles/Permissions lists: one request per
// distinct query (re-renders alone never refetch), older requests cancelled,
// results tagged with the query they belong to.

export interface NoticesQuery {
    page: number;
    perPage: number;
}

interface NoticesResult {
    key: string; // the query this result belongs to
    notices: NoticeItem[];
    pagination: PaginationMeta | null;
    error: string | null;
}

export const useNoticesList = ({ page, perPage }: NoticesQuery) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<NoticesResult | null>(null);

    const requestKey = JSON.stringify({ page, perPage, reloadToken });

    useEffect(() => {
        const controller = new AbortController();

        getNotices({ page, per_page: perPage }, controller.signal)
            .then((response) => {
                if (controller.signal.aborted) return;

                setResult({
                    key: requestKey,
                    notices: response.data,
                    pagination: response.pagination,
                    error: null,
                });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                // 401 is handled globally. The fixed id keeps a retry from
                // stacking duplicate toasts.
                if (status !== 401) {
                    toast.error(message, { toastId: "notices-list-error" });
                }

                setResult((previous) => ({
                    key: requestKey,
                    notices: [],
                    pagination: previous?.pagination ?? null,
                    error: message,
                }));
            });

        return () => controller.abort();
    }, [page, perPage, requestKey]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.key === requestKey;

    return {
        // While a new page loads, the previous notices stay visible
        notices: result?.notices ?? [],
        pagination: result?.pagination ?? null,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        hasLoaded: result !== null,
        retry,
    };
};
