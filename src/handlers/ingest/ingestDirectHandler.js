import { getWhiteHouseEO } from '../../services/sources/whitehouseEO.js'
import { textColor } from '../../utils/helpers.js'
import { presidentLookup } from '../../utils/president-lookup.js';

//todo update handler name to INGEST
export async function handleFetchDirect(url) {
    try {
        console.log(textColor('info', `Attempting to fetch from ${url}`))
        const data = await getWhiteHouseEO(url);
        console.log(textColor('success', `Success! Fetched EO: ${data.title}`))

        //method to evaluate president/admin
        const president = presidentLookup(data.publish_date_iso)
        console.log(`the president that authored this EO is: ${president.id} ${president.last_name}`)
        
        //todo create method to save returned data to db

        return data
    } catch (error) {
        console.error(textColor('error', `Failed to fetch: ${error.message}`))
        process.exit(1)
    }
}