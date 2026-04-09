import { president_details } from "../db/local/president_constants.js";

export const presidentLookup = (signatureDate) => {
    if (!signatureDate) return null;

    const lookupDate = new Date(signatureDate);
    if (Number.isNaN(lookupDate.getTime())) return null;

    const match = president_details.find((president) => {
        const start = new Date(president.term_start)
        const end = president.term_end ? new Date(president.term_end) : null;

        return lookupDate >= start && (end === null || lookupDate < end);
    });
    return match ?? null;
};