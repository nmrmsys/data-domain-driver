#!/usr/bin/env node
'use strict'

const program = require('commander');

program
  .option('-f, --force', 'force migrate')
  .parse(process.argv);

const args = program.args;

// if (!args.length) {
//   console.error('args required');
//   process.exit(1);
// }

// if (program.force)
//   console.log('  force: migrate');

// args.forEach(function(pkg) {
//   console.log('  migrate : %s', pkg);
// });

// const Task = require('data-domain-driver').Task;
const Task = require('../index').Task;

class Migrate extends Task {

}

// const DDDRunner = new (require('data-domain-driver').DDDRunner)();
const DDDRunner = new (require('../index').DDDRunner)();

DDDRunner.runTask(new Migrate(args));
