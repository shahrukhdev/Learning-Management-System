import { useEffect, useState } from "react";

// Returns `value` only after it has stopped changing for `delay` ms
export const useDebouncedValue = <T,>(value: T, delay: number): T => {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedValue(value), delay);

        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};
