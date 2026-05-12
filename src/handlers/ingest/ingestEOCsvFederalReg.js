import { getFederalRegEO } from '../../services/sources/federalregisterEO.js';
import { textColor } from '../../utils/helpers.js';
import { csvParser } from '../../utils/csv-parser.js';
import { presidentLookup } from '../../utils/president-lookup.js';
import { saveFederalRegEO } from '../../services/db/saveFederalRegEO.js';

export async function handleFetchEOCsvFromFederalReg(csvPath){
    const csvRows = await csvParser(csvPath);

    for (const csvRow of csvRows) {
        
        try {
            console.log(textColor('info', `Attempting to fetch from ${csvRow.url}`))
            const pageData = await getFederalRegEO(csvRow.url)
            console.log(textColor('success', `Success! Fetched EO: ${csvRow.title}`))

            await saveFederalRegEO(federalRegEoCSVAdapter(csvRow, pageData));
            console.log(textColor('success', `Success! Saved EO to DB: ${csvRow.title}`))

        } catch (error) {
            console.error(textColor('error', `Failed to fetch and save to DB ${error.message}`))

        }

    }
}

function federalRegEoCSVAdapter(csvObject, pageObject) { 

    // data adapter for source data using both the CSV and page text => db Schema
    const orderNumber = csvObject.order_number.trim();
    const title = csvObject.title.trim();
    const url = csvObject.url;
    const signing_date = pageObject.signing_date;
    const retrieved_date = Date.now();

    const evaluated_president = presidentLookup(signing_date);
    const president = evaluated_president.last_name;

    const original_text = pageObject.text;

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