// The one place browser titles are built: "[Page Name] - Noor Ul Imaan Masjid"
export const APP_NAME = "Noor Ul Imaan Masjid";

const TITLE_SEPARATOR = " - ";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A trailing brand suffix pages may already include (" - " or " | ")
const BRAND_SUFFIX = new RegExp(`\\s*[-|–]\\s*${escapeRegExp(APP_NAME)}\\s*$`, "i");

// "Dashboard" / "Dashboard | Noor Ul Imaan Masjid" -> "Dashboard - Noor Ul Imaan Masjid";
// an empty page name (or the brand alone) -> "Noor Ul Imaan Masjid"
export const formatPageTitle = (title: string): string => {
    const pageName = title.trim().replace(BRAND_SUFFIX, "").trim();

    if (!pageName || pageName.toLowerCase() === APP_NAME.toLowerCase()) return APP_NAME;

    return `${pageName}${TITLE_SEPARATOR}${APP_NAME}`;
};
