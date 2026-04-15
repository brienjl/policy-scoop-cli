import { textColor } from '../../utils/helpers.js';

export async function getFederalRegEO(url) {

        const parsedUrl = parseUrl(url);
        const response = await fetch(parsedUrl, {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0; Chrome/146.0.0.0 Safari/537.36",
            "Accept": "text/html",
            "Accept-Language": "en-US"
        }
    });

    if (!response.ok) {
        console.error(textColor('error', `failed to fetch: ${parsedUrl} ==> from: ${url} Response status: ${response.status}`))
    }
        const html = await response.text();
        const main = extractMainHtml(html);
        const title = extractTitle(main);
        const paragraphs = extractParagraphs(main)

        return {
            url,
            title,
            text: paragraphs.join("\n\n")
        };
};

// the returned url is the pre-rendered html page from the federal register and will load
// less resources on our source and contains all the info we need to get the text and title
function parseUrl(url) {
    const match = url.match(
        /^https?:\/\/www\.federalregister\.gov\/documents\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)(?:\/.*)?$/i
    );

    if (!match) {
        console.error(`Invalid federal reg EO url: ${url}`);
    }

    const [, year, month, day, documentNumber] = match;
    return `https://www.federalregister.gov/documents/full_text/html/${year}/${month}/${day}/${documentNumber}`;
};

function extractMainHtml(html) {
    const match = html.match(/<main[\s\S]*?<\/main>/i);
    return match ? match[0] : html;
};

function extractTitle(html) {

    const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    if(!match) return null;

    return cleanText(stripTags(match[1]));
};

function extractParagraphs(html) {
    return [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(match => match[1])
        .map(stripTags)
        .map(cleanText)
        .filter(Boolean);
}

function stripTags(input) {
    return input.replace(/<[^>]+>/g, " ");
};

function cleanText(input) {
    return decodeHtml(input)
        .replace(/\s+/g, " ")
        .trim();
};

function decodeHtml(input) {
    return input
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#8217;/g, "’")
        .replace(/&#8220;/g, "“")
        .replace(/&#8221;/g, "”")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—");
};