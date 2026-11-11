// Local-date helpers (no timezone shifts). API dates are Y-m-d.

export const toYmd = (date: Date): string =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");

export const fromYmd = (value: string): Date => new Date(`${value}T00:00:00`);

export const todayYmd = (): string => toYmd(new Date());

// Monday of the week containing `value`
export const getWeekStart = (value: string): string => {
    const date = fromYmd(value);
    const offset = (date.getDay() + 6) % 7; // Mon = 0 ... Sun = 6
    date.setDate(date.getDate() - offset);
    return toYmd(date);
};

export const addDays = (value: string, days: number): string => {
    const date = fromYmd(value);
    date.setDate(date.getDate() + days);
    return toYmd(date);
};

// e.g. "Nov 11, 2026" (same style as the existing attendance header)
export const formatDisplayDate = (value: string): string =>
    fromYmd(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// e.g. "9 Nov - 13 Nov 2026" (same style as the existing overview header)
export const formatWeekRange = (weekStart: string): string => {
    const start = fromYmd(weekStart);
    const end = fromYmd(addDays(weekStart, 4));

    const dayMonth = (date: Date) => date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

    return `${dayMonth(start)} - ${dayMonth(end)} ${end.getFullYear()}`;
};
