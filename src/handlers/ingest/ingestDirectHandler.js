import { getWhiteHouseEO } from '../../services/whitehouseEO.js'

export async function handleFetchDirect(url) {
    try {
        const data = await getWhiteHouseEO(url);
        return data
    } catch (e) {
        console.error(e.message)
        process.exit(1)
    }
}