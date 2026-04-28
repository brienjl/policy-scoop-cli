import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { csvParser } from '../src/utils/csv-parser.js';

test('csv parser returns normalized rows from a Federal Reg CSV file', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csv-parser-test-'));
    const csvPath = path.join(tempDir, 'executive-orders.csv')
    const csvData = 
`citation,document_number,end_page,html_url,pdf_url,type,subtype,publication_date,signing_date,start_page,title,disposition_notes,executive_order_number
87 FR 14143,2022-05471,14152,url 1,url 1-2,Presidential Document,Executive Order,3/14/22,3/9/22,14143,"Awesome Title 1","Revoked by: EO 14178, January 23, 2025",14067
86 FR 57313,2021-22588,57318,url 2,url 2-2,Presidential Document,Executive Order,10/14/21,10/11/21,57313,"Awesome Title 2","Supersedes: EO 13592, December 2, 2011
See: EO 13647, June 26, 2013; EO 14091, February 16, 2023
Revoked by: EO 14148, January 20, 2025",14049`;
    
    try {

    fs.writeFileSync(csvPath, csvData, 'utf-8');

    const rows = await csvParser(csvPath);

    assert.equal(rows.length, 2);
    assert.deepEqual(rows[0], {
        url: 'url 1',
        title: 'Awesome Title 1',
        date_signed: '3/9/22',
        order_number: '14067'
    });

    assert.deepEqual(rows[1], {
        url: 'url 2',
        title: 'Awesome Title 2',
        date_signed: '10/11/21',
        order_number: '14049'
    });

    } finally {
        fs.rmSync(csvPath, { recursive: true, force: true });
    }
});

test('csv parser skips rows missing html_url', async() => {

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csv-parser-test-'));
    const csvPath = path.join(tempDir, 'missing-url.csv');
    const csvData = 
`html_url,title,signing_date,executive_order_number
url 1,Valid Row,1/1/25,99999
,Missing URL,1/2/25,99998`;

    try {

        fs.writeFileSync(csvPath, csvData, 'utf-8');

        const rows = await csvParser(csvPath);

        assert.equal(rows.length, 1);

        assert.deepEqual(rows[0], {
        url: 'url 1',
        title: 'Valid Row',
        date_signed: '1/1/25',
        order_number: '99999'
    });

    } finally {
        fs.rmSync(csvPath, { recursive: true, force: true });
    }
});

test('csv parser throws an error when file does not exist', async () => {
    await assert.rejects(
        () => csvParser('./does-not-exist.csv'),
        /File not found/
    );
});