// quranMapData.ts

export type SurahStatus = | "memorised" | "progress" | "not-started";

export interface Surah {
    number: number;
    name: string;
    arabic: string;
    ayahs: number;
}

export interface Juz {
    number: number;
    name: string;
    surahNumbers: number[];
}

    /*
    * Surah information
    * Quran has 114 Surahs.
    */
    export const SURAH_DATA: Surah[] = [
        { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", ayahs: 7 },
        { number: 2, name: "Al-Baqarah", arabic: "البقرة", ayahs: 286 },
        { number: 3, name: "Aal-Imran", arabic: "آل عمران", ayahs: 200 },
        { number: 4, name: "An-Nisa", arabic: "النساء", ayahs: 176 },
        { number: 5, name: "Al-Maidah", arabic: "المائدة", ayahs: 120 },
        { number: 6, name: "Al-Anam", arabic: "الأنعام", ayahs: 165 },
        { number: 7, name: "Al-Araf", arabic: "الأعراف", ayahs: 206 },
        { number: 8, name: "Al-Anfal", arabic: "الأنفال", ayahs: 75 },
        { number: 9, name: "At-Tawbah", arabic: "التوبة", ayahs: 129 },
        { number: 10, name: "Yunus", arabic: "يونس", ayahs: 109 },
        { number: 11, name: "Hud", arabic: "هود", ayahs: 123 },
        { number: 12, name: "Yusuf", arabic: "يوسف", ayahs: 111 },
        { number: 13, name: "Ar-Rad", arabic: "الرعد", ayahs: 43 },
        { number: 14, name: "Ibrahim", arabic: "إبراهيم", ayahs: 52 },
        { number: 15, name: "Al-Hijr", arabic: "الحجر", ayahs: 99 },
        { number: 16, name: "An-Nahl", arabic: "النحل", ayahs: 128 },
        { number: 17, name: "Al-Isra", arabic: "الإسراء", ayahs: 111 },
        { number: 18, name: "Al-Kahf", arabic: "الكهف", ayahs: 110 },
        { number: 19, name: "Maryam", arabic: "مريم", ayahs: 98 },
        { number: 20, name: "Ta-Ha", arabic: "طه", ayahs: 135 },
        { number: 21, name: "Al-Anbiya", arabic: "الأنبياء", ayahs: 112 },
        { number: 22, name: "Al-Hajj", arabic: "الحج", ayahs: 78 },
        { number: 23, name: "Al-Muminun", arabic: "المؤمنون", ayahs: 118 },
        { number: 24, name: "An-Nur", arabic: "النور", ayahs: 64 },
        { number: 25, name: "Al-Furqan", arabic: "الفرقان", ayahs: 77 },
        { number: 26, name: "Ash-Shuara", arabic: "الشعراء", ayahs: 227 },
        { number: 27, name: "An-Naml", arabic: "النمل", ayahs: 93 },
        { number: 28, name: "Al-Qasas", arabic: "القصص", ayahs: 88 },
        { number: 29, name: "Al-Ankabut", arabic: "العنكبوت", ayahs: 69 },
        { number: 30, name: "Ar-Rum", arabic: "الروم", ayahs: 60 },
        { number: 31, name: "Luqman", arabic: "لقمان", ayahs: 34 },
        { number: 32, name: "As-Sajdah", arabic: "السجدة", ayahs: 30 },
        { number: 33, name: "Al-Ahzab", arabic: "الأحزاب", ayahs: 73 },
        { number: 34, name: "Saba", arabic: "سبأ", ayahs: 54 },
        { number: 35, name: "Fatir", arabic: "فاطر", ayahs: 45 },
        { number: 36, name: "Ya-Sin", arabic: "يس", ayahs: 83 },
        { number: 37, name: "As-Saffat", arabic: "الصافات", ayahs: 182 },
        { number: 38, name: "Sad", arabic: "ص", ayahs: 88 },
        { number: 39, name: "Az-Zumar", arabic: "الزمر", ayahs: 75 },
        { number: 40, name: "Ghafir", arabic: "غافر", ayahs: 85 },
        { number: 41, name: "Fussilat", arabic: "فصلت", ayahs: 54 },
        { number: 42, name: "Ash-Shura", arabic: "الشورى", ayahs: 53 },
        { number: 43, name: "Az-Zukhruf", arabic: "الزخرف", ayahs: 89 },
        { number: 44, name: "Ad-Dukhan", arabic: "الدخان", ayahs: 59 },
        { number: 45, name: "Al-Jathiyah", arabic: "الجاثiyah", ayahs: 37 },
        { number: 46, name: "Al-Ahqaf", arabic: "الأحقاف", ayahs: 35 },
        { number: 47, name: "Muhammad", arabic: "محمد", ayahs: 38 },
        { number: 48, name: "Al-Fath", arabic: "الفتح", ayahs: 29 },
        { number: 49, name: "Al-Hujurat", arabic: "الحجرات", ayahs: 18 },
        { number: 50, name: "Qaf", arabic: "ق", ayahs: 45 },
        { number: 51, name: "Adh-Dhariyat", arabic: "الذاريات", ayahs: 60 },
        { number: 52, name: "At-Tur", arabic: "الطور", ayahs: 49 },
        { number: 53, name: "An-Najm", arabic: "النجم", ayahs: 62 },
        { number: 54, name: "Al-Qamar", arabic: "القمر", ayahs: 55 },
        { number: 55, name: "Ar-Rahman", arabic: "الرحمن", ayahs: 78 },
        { number: 56, name: "Al-Waqiah", arabic: "الواقعة", ayahs: 96 },
        { number: 57, name: "Al-Hadid", arabic: "الحديد", ayahs: 29 },
        { number: 58, name: "Al-Mujadilah", arabic: "المجادلة", ayahs: 22 },
        { number: 59, name: "Al-Hashr", arabic: "الحشر", ayahs: 24 },
        { number: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", ayahs: 13 },
        { number: 61, name: "As-Saff", arabic: "الصف", ayahs: 14 },
        { number: 62, name: "Al-Jumuah", arabic: "الجمعة", ayahs: 11 },
        { number: 63, name: "Al-Munafiqun", arabic: "المنافقون", ayahs: 11 },
        { number: 64, name: "At-Taghabun", arabic: "التغابن", ayahs: 18 },
        { number: 65, name: "At-Talaq", arabic: "الطلاق", ayahs: 12 },
        { number: 66, name: "At-Tahrim", arabic: "التحريم", ayahs: 12 },
        { number: 67, name: "Al-Mulk", arabic: "الملك", ayahs: 30 },
        { number: 68, name: "Al-Qalam", arabic: "القلم", ayahs: 52 },
        { number: 69, name: "Al-Haqqah", arabic: "الحاقة", ayahs: 52 },
        { number: 70, name: "Al-Maarij", arabic: "المعارج", ayahs: 44 },
        { number: 71, name: "Nuh", arabic: "نوح", ayahs: 28 },
        { number: 72, name: "Al-Jinn", arabic: "الجن", ayahs: 28 },
        { number: 73, name: "Al-Muzzammil", arabic: "المزمل", ayahs: 20 },
        { number: 74, name: "Al-Muddaththir", arabic: "المدثر", ayahs: 56 },
        { number: 75, name: "Al-Qiyamah", arabic: "القيامة", ayahs: 40 },
        { number: 76, name: "Al-Insan", arabic: "الإنسان", ayahs: 31 },
        { number: 77, name: "Al-Mursalat", arabic: "المرسلات", ayahs: 50 },
        { number: 78, name: "An-Naba", arabic: "النبأ", ayahs: 40 },
        { number: 79, name: "An-Naziat", arabic: "النازعات", ayahs: 46 },
        { number: 80, name: "Abasa", arabic: "عبس", ayahs: 42 },
        { number: 81, name: "At-Takwir", arabic: "التكوير", ayahs: 29 },
        { number: 82, name: "Al-Infitar", arabic: "الانفطار", ayahs: 19 },
        { number: 83, name: "Al-Mutaffifin", arabic: "المطففين", ayahs: 36 },
        { number: 84, name: "Al-Inshiqaq", arabic: "الانشقاق", ayahs: 25 },
        { number: 85, name: "Al-Buruj", arabic: "البروج", ayahs: 22 },
        { number: 86, name: "At-Tariq", arabic: "الطارق", ayahs: 17 },
        { number: 87, name: "Al-Ala", arabic: "الأعلى", ayahs: 19 },
        { number: 88, name: "Al-Ghashiyah", arabic: "الغاشية", ayahs: 26 },
        { number: 89, name: "Al-Fajr", arabic: "الفجر", ayahs: 30 },
        { number: 90, name: "Al-Balad", arabic: "البلد", ayahs: 20 },
        { number: 91, name: "Ash-Shams", arabic: "الشمس", ayahs: 15 },
        { number: 92, name: "Al-Lail", arabic: "الليل", ayahs: 21 },
        { number: 93, name: "Ad-Duha", arabic: "الضحى", ayahs: 11 },
        { number: 94, name: "Ash-Sharh", arabic: "الشرح", ayahs: 8 },
        { number: 95, name: "At-Tin", arabic: "التين", ayahs: 8 },
        { number: 96, name: "Al-Alaq", arabic: "العلق", ayahs: 19 },
        { number: 97, name: "Al-Qadr", arabic: "القدر", ayahs: 5 },
        { number: 98, name: "Al-Bayyinah", arabic: "البينة", ayahs: 8 },
        { number: 99, name: "Az-Zalzalah", arabic: "الزلزلة", ayahs: 8 },
        { number: 100, name: "Al-Adiyat", arabic: "العاديات", ayahs: 11 },
        { number: 101, name: "Al-Qariah", arabic: "القارعة", ayahs: 11 },
        { number: 102, name: "At-Takathur", arabic: "التكاثر", ayahs: 8 },
        { number: 103, name: "Al-Asr", arabic: "العصر", ayahs: 3 },
        { number: 104, name: "Al-Humazah", arabic: "الهمزة", ayahs: 9 },
        { number: 105, name: "Al-Fil", arabic: "الفيل", ayahs: 5 },
        { number: 106, name: "Quraysh", arabic: "قريش", ayahs: 4 },
        { number: 107, name: "Al-Maun", arabic: "الماعون", ayahs: 7 },
        { number: 108, name: "Al-Kawthar", arabic: "الكوثر", ayahs: 3 },
        { number: 109, name: "Al-Kafirun", arabic: "الكافرون", ayahs: 6 },
        { number: 110, name: "An-Nasr", arabic: "النصر", ayahs: 3 },
        { number: 111, name: "Al-Masad", arabic: "المسد", ayahs: 5 },
        { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", ayahs: 4 },
        { number: 113, name: "Al-Falaq", arabic: "الفلق", ayahs: 5 },
        { number: 114, name: "An-Nas", arabic: "الناس", ayahs: 6 },
    ];

    /*
    * Only Surahs that START in that Juz are listed.
    *
    * Example:
    * Juz 2 contains Al-Baqarah, but Al-Baqarah
    * started in Juz 1, therefore Juz 2 is empty.
    */
    export const JUZ_DATA: Juz[] = [
    { number: 1, name: "Alif Lam Meem", surahNumbers: [1, 2] },
    { number: 2, name: "Sayaqool", surahNumbers: [] },
    { number: 3, name: "Tilkal Rusul", surahNumbers: [3] },
    { number: 4, name: "Lan Tana Loo", surahNumbers: [4] },
    { number: 5, name: "Wal Muhsanat", surahNumbers: [] },
    { number: 6, name: "La Yuhibbullah", surahNumbers: [5] },
    { number: 7, name: "Wa Iza Samiu", surahNumbers: [6] },
    { number: 8, name: "Wa Lau Annana", surahNumbers: [7] },
    { number: 9, name: "Qalal Malao", surahNumbers: [8] },
    { number: 10, name: "Wa A'lamu", surahNumbers: [9] },
    { number: 11, name: "Yatazeroon", surahNumbers: [] },
    { number: 12, name: "Wa Mamin Da'abat", surahNumbers: [12] },
    { number: 13, name: "Wa Ma Ubrioo", surahNumbers: [13, 14] },
    { number: 14, name: "Rubama", surahNumbers: [15, 16] },
    { number: 15, name: "Subhanallazi", surahNumbers: [17] },
    { number: 16, name: "Qal Alam", surahNumbers: [19, 20] },
    { number: 17, name: "Iqtaraba", surahNumbers: [21, 22] },
    { number: 18, name: "Qad Aflaha", surahNumbers: [23, 24] },
    { number: 19, name: "Wa Qalallazina", surahNumbers: [25, 26] },
    { number: 20, name: "A'man Khalaq", surahNumbers: [27, 28, 29] },
    { number: 21, name: "Utlu Ma Oohi", surahNumbers: [30, 31, 32, 33] },
    { number: 22, name: "Wa Manyaqnut", surahNumbers: [34, 35, 36] },
    { number: 23, name: "Wa Mali", surahNumbers: [37, 38, 39] },
    { number: 24, name: "Faman Azlam", surahNumbers: [40, 41] },
    { number: 25, name: "Ilayhi Yurad", surahNumbers: [42, 43, 44, 45] },
    { number: 26, name: "Ha Meem", surahNumbers: [46, 47, 48, 49, 50, 51] },
    { number: 27, name: "Qala Fama Khatbukum", surahNumbers: [52, 53, 54, 55, 56, 57] },
    { number: 28, name: "Qad Sami Allah", surahNumbers: [58, 59, 60, 61, 62, 63, 64, 65, 66] },
    { number: 29, name: "Tabarakallazi", surahNumbers: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77] },
    {
        number: 30,
        name: "Amma",
        surahNumbers: Array.from(
            { length: 37 },
            (_, index) => index + 78
        ),
    },
];

export const DEFAULT_STATUS: Record<number, SurahStatus> = {
    // Demo values matching the visual direction of your screenshot.
    1: "not-started",
    2: "not-started",
    3: "not-started",

    // Example memorised area visible in your screenshot.
    ...Object.fromEntries(
        Array.from({ length: 37 }, (_, index) => [
            index + 78,
            "memorised",
        ])
    ),
};