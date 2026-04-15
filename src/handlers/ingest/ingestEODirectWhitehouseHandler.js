import { getWhiteHouseEO } from '../../services/sources/whitehouseEO.js'
import { textColor } from '../../utils/helpers.js'
import { presidentLookup } from '../../utils/president-lookup.js';
import { saveEO } from '../../services/db/saveWhiteHouseEO.js';

export async function handleFetchEODirectFromWhiteHouse(url) {
    try {
        console.log(textColor('info', `Attempting to fetch from ${url}`))
        const data = await getWhiteHouseEO(url);
        console.log(textColor('success', `Success! Fetched EO: ${data.title}`))
        
        await saveEO(whiteHouseEODataAdapter(data))
        console.log(textColor('success', `Success! Saved EO to DB: ${data.title}`))

        process.exit(0);
    } catch (error) {
        console.error(textColor('error', `Failed to fetch and save to DB: ${error.message}`))
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
    
    // lookup who the president is based on signing date
    const evaluated_president = presidentLookup(signing_date);
    const president = evaluated_president.last_name;
    
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