import { getFederalRegEO } from '../../services/sources/federalregisterEO.js'
// import { textColor } from '../../utils/helpers.js'

export async function handleFetchEODirectFromFederalReg(url) {
    try {
        const data = await getFederalRegEO(url);
        process.exit(0)

    } catch (error) {

    }

}