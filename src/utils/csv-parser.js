import fs from 'fs';
import csv from 'csv-parser';
import { textColor } from './helpers.js';

export async function csvParser(csvPath) {

    if (!fs.existsSync(csvPath)) {
        throw new Error(textColor(`File not found: ${csvPath}`))
    }

    console.log(textColor('info', `Reading csv from ${csvPath}`))

    const rows = [];
    let successfulReadsCount = 0;
    let errorReadsCount = 0;
    let totalRows = 0;

    const stream = fs.createReadStream(csvPath).pipe(csv());

    for await (const line of stream){
        totalRows++;

        const row = {
            url: line.html_url,
            title: line.title,
            date_signed: line.signing_date,
            order_number: line.executive_order_number
        };

        if (!row.url) {
            console.error(textColor('error', `Skipping row ${totalRows}. Missing url.`));
            errorReadsCount++;
            continue;
        };

        successfulReadsCount++;
        rows.push(row);
    }

    console.log(textColor('info', 
    `Batch Complete. 
    Total Rows Processed: ${totalRows}.
    Rows Succeeded: ${successfulReadsCount},
    Rows Skipped: ${errorReadsCount}`));

    console.log(rows);
    return rows;
};

csvParser('/Users/jeremybrien/Documents/repo/policy-scoop-cli/documents_signed_from_01_20_2009_to_01_20_2017_signed_by_barack_obama_of_type_presidential_document_and_of_presidential_document_type_executive_order.csv');
