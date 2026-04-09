import { textColor } from '../../utils/helpers.js';

export async function getWhiteHouseEO(url) {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0; Chrome/146.0.0.0 Safari/537.36",
            "Accept": "text/html",
            "Accept-Language": "en-US"
        }
    });

    if (!response.ok) {
        console.error(textColor('error', `failed to fetch ${url}: ${response.status}`));
    }
        const html = await response.text();
        const main = extractMainHtml(html);
        const title = extractTitle(html)
        const publishDate = extractPublishDate(html)
        const paragraphs = extractParagraphs(main);

        console.log(`iso date is: ${publishDate.iso}`)
        console.log(`display date is: ${publishDate.display}`)

        return { 
            url,
            title,
            text: paragraphs.join("\n\n"),
            publish_date_iso: publishDate.iso,
            publish_date_display: publishDate.display

        };

}

//
// Note 1.
// MVP used axios and cheerio for fetching and destructuring a DOM-like object;
// However, due to NPM/SBOM attacks over the last year, I'm opting to keep this project
// as dependency-free as possible. If there's scaling opportunities, consider
// adding axios/cheerio with as pinned dependencies and removing any auto-downloads 
// in CI/CD processes (see architectural decision log)
//

//
// Note 2.
// These functions might be worth abstracting into it's own module for reuse if
// we build more WhiteHouse.gov services and the page structure is consistent. 
// For now, keep in the service as they're related and needed for destructuring
// the page. 
// 
function extractMainHtml(html) {
    const match = html.match(/<main[\s\S]*?<\/main>/i);
    console.log(textColor('info', `Extracting HTML from page...`))
    return match ? match[0] : html;
}

function extractTitle(html) {
    const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    console.log(textColor('info', `Extracting H1 as Title from page...`))
    if(!match) return null;

    return cleanText(stripTags(match[1]));
}

function extractPublishDate(html) {
    const match = html.match(/<time[^>]*datetime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/i);
    console.log(textColor('info', `Extracting publish date from page...`))
    if (!match) return null;

    return {
        iso: match[1],
        display: cleanText(stripTags(match[2]))
    }
};

function extractParagraphs(html) {
    console.log(textColor('info', `Mapping paragraph text and scrubbing...`))
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