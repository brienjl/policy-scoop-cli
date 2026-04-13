import { getWhiteHouseEO } from '../../services/sources/whitehouseEO.js'
import { textColor } from '../../utils/helpers.js'
import { presidentLookup } from '../../utils/president-lookup.js';
import { saveEO } from '../../services/db/saveWhiteHouseEO.js';

//todo update handler name to INGEST
export async function handleFetchDirect(url) {
    try {
        console.log(textColor('info', `Attempting to fetch from ${url}`))
        const data = await getWhiteHouseEO(url);
        console.log(textColor('success', `Success! Fetched EO: ${data.title}`))
        
        await saveEO(whiteHouseEODataAdapter(data))
        console.log(textColor('success', `Success! Saved EO to DB: ${data.title}`))

        process.exit(0);
    } catch (error) {
        console.error(textColor('error', `Failed to fetch: ${error.message}`))
        process.exit(1)
    }
}

function whiteHouseEODataAdapter (object) {
    // data adapter for source data => db Schema
    const orderNumber = object.url.split('/').slice(-2).join('/');
    const title = object.title.trim();
    const url = object.url;
    const signing_date = object.publish_date_iso;
    const retrieved_date = Date.now();
    const president = presidentLookup(signing_date);
    const original_text = object.text;

    return {
        orderNumber,
        title,
        url,
        signing_date,
        retrieved_date,
        president,
        original_text
    }
}