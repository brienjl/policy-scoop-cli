import { getWhiteHouseEO } from '../../services/sources/whitehouseEO.js'
import { textColor } from '../../utils/helpers.js'

//todo update handler name to INGEST
export async function handleFetchDirect(url) {
    try {
        console.log(textColor('info', `Attempting to fetch from ${url}`))
        const data = await getWhiteHouseEO(url);
        console.log(textColor('success', `Success! Fetched EO: ${data.title}`))

        //todo create method to save returned data to db

        return data
    } catch (error) {
        console.error(textColor('error', `Failed to fetch: ${error.message}`))
        process.exit(1)
    }
}