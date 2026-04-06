import { getWhiteHouseEO } from '../../services/whitehouseEO.js'
import { textColor } from '../../utils/helpers.js'

export async function handleFetchDirect(url) {
    try {
        console.log(textColor('info', `Attempting to fetch from ${url}`))
        const data = await getWhiteHouseEO(url);
        console.log(textColor('success', `Success! Fetched EO: ${data.title}`))
        return data
    } catch (error) {
        console.error(textColor('error', `Failed to fetch: ${error.message}`))
        process.exit(1)
    }
}