#!/usr/bin/env node
"use strict";

import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory of the current file (bin folder)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Programmatically load the .env file from the root of cli-policy-scoop
process.loadEnvFile(path.resolve(__dirname, '../.env'));

await import('../src/cli.js');