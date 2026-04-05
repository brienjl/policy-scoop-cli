import { Command } from "commander";
import { handleFetchDirect } from './handlers/ingest/ingestDirectHandler.js'

const program = new Command();

program
  .name('Policy Scoop CLI')
  .description('A CLI tool kit to perform analysis of public policy in the U.S.')
  .version('0.0.1');

program
    .command('ingest-eo-whitehouse-url <url>')
    .description('ingest an eo from whitehouse url')
    .action(async(url) => {
        const response = await handleFetchDirect(url)
        console.log(response.text);
    });

program.parse();