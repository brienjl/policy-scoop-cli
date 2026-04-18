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
        throw new Error(
            textColor(
                'error',
                `failed to fetch: ${parsedUrl} ==> from: ${url} Response status: ${response.status}`
            )
        );
    }

    const html = await response.text();
    const main = extractMainHtml(html);
    const meta = extractOrderNumberAndSigningDate(main);

    if (!meta) {
        throw new Error(`Could not extract EO metadata from ${url}`);
    }

    const orderNumber = meta.eoNumber;
    const title = extractTitle(main);
    const paragraphs = extractParagraphs(main);
    const signing_date = meta.publishedAt;


    return {
        url,
        orderNumber,
        title,
        signing_date,
        text: paragraphs.join("\n\n")
    };
}

function parseUrl(url) {
    const match = url.match(
        /^https?:\/\/www\.federalregister\.gov\/documents\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)(?:\/.*)?$/i
    );

    if (!match) {
        throw new Error(`Invalid federal reg EO url: ${url}`);
    }

    const [, year, month, day, documentNumber] = match;
    return `https://www.federalregister.gov/documents/full_text/html/${year}/${month}/${day}/${documentNumber}`;
}

function extractMainHtml(html) {
    const match = html.match(/<main[\s\S]*?<\/main>/i);
    return match ? match[0] : html;
}

function extractOrderNumberAndSigningDate(html) {
    const plainText = cleanText(stripTags(html));

    const match = plainText.match(
        /Executive Order\s+(\d+)\s+of\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i
    );

    if (!match) return null;

    const eoNumber = match[1];
    const rawDate = match[2];

    const [monthName, day, year] = rawDate.replace(",", "").split(" ");

    const monthMap = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
    };

    const date = new Date(
        Date.UTC(
            parseInt(year, 10),
            monthMap[monthName],
            parseInt(day, 10)
        )
    );

    if (Number.isNaN(date.getTime())) return null;

    return {
        eoNumber,
        rawDate,
        publishedAt: date.toISOString(),
        epoch: date.getTime(),
        publishedDisplay: rawDate
    };
}

function extractTitle(html) {
    const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    if (!match) return null;

    return cleanText(stripTags(match[1]));
}

function extractParagraphs(html) {
    return [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(match => match[1])
        .map(stripTags)
        .map(cleanText)
        .filter(Boolean);
}

function stripTags(input) {
    return input.replace(/<[^>]+>/g, " ");
}

function cleanText(input) {
    return decodeHtml(input)
        .replace(/\s+/g, " ")
        .trim();
}

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
}