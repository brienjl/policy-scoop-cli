import { getFederalRegEO } from '../../services/sources/federalregisterEO.js'
import { textColor } from '../../utils/helpers.js';
import { presidentLookup } from '../../utils/president-lookup.js';
import { saveFederalRegEO } from '../../services/db/saveFederalRegEO.js';

export async function handleFetchEODirectFromFederalReg(url) {
    try {
        console.log(textColor('info', `Attempting to fetch from ${url}`))
        const data = await getFederalRegEO(url);
        console.log(textColor('success', `Success! Fetched EO: ${data.title}`))
        
        await saveFederalRegEO(federalRegisterEOAdapter(data))
        console.log(textColor('success', `Success! Saved EO to DB: ${data.title}`))
        
        process.exit(0);
    } catch (error) {
        console.error(textColor('error', `Failed to fetch and save to DB ${error.message}`))
        process.exit(1);
    }

}

function federalRegisterEOAdapter(object) {

    // data adapter for source data => db Schema
    const orderNumber = object.orderNumber.trim();
    const title = object.title.trim();
    const url = object.url;
    const signing_date = object.signing_date;
    const retrieved_date = Date.now();

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