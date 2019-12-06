#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.1')
  .command('migrate', 'migrate data domain', {executableFile: 'cli/migrate.js'})
  .parse(process.argv)
