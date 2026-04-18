import connectDB from "../../db/connect.js";
import ExecutiveOrder from '../../db/schemas/federalregEOSchema.js';

export const saveFederalRegEO = async (parsedData) => {
    const { orderNumber, title, url, retrieved_date, signing_date, president, original_text } = parsedData;

    await connectDB();

    const eo = await ExecutiveOrder.findOneAndUpdate(
        { orderNumber: orderNumber },
        {
            title: title,
            url: url,
            retrieved_date: retrieved_date,
            signing_date: signing_date,
            president: president,
            original_text: original_text
        },
        { returnDocument: 'after', upsert: true }
    );

    return eo;
}