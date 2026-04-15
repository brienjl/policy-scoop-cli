import { Command } from "commander";
import { handleFetchEODirectFromWhiteHouse } from './handlers/ingest/ingestEODirectWhitehouseHandler.js'
import { handleFetchEODirectFromFederalReg } from "./handlers/ingest/ingestEODirectFederalReg.js";
const program = new Command();

program
    .name('Policy Scoop CLI')
    .description('A CLI tool kit to perform analysis of public policy in the U.S.')
    .version('0.0.1');

program
    .command('ingest-eo-whitehouse-url <url>')
    .description('ingest an eo from whitehouse url')
    .action(async(url) => {
        await handleFetchEODirectFromWhiteHouse(url)
    });

program
    .command('ingest-eo-federalregister-url <url>')
    .description('ingest an eo from federal register url')
    .action(async(url) => {
        await handleFetchEODirectFromFederalReg(url)
    });

program.parse();