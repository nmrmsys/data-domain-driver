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
const glob = require('glob');
const fs = require('fs');

class Migrate extends Task {

  async run(args, domain, DDD, ddd) {
    await super.run(args, domain, DDD, ddd);
    const files = glob.sync(DDD._getPath('ddl') + '**/*.sql');
    for (let file of files) {
      const text = fs.readFileSync(file, 'utf-8');
      const sqls = text.replace(/(\r\n|\r|\n)/g,'').split(";");
      for (let sql of sqls) {
        if(sql){
          // log('"'+sql+'"');
          await ddd.execute(sql);
        }
      }
    }
  }

}

async function main(){
  // const DDDRunner = new (require('data-domain-driver').DDDRunner)();
  const DDDRunner = new (require('../index').DDDRunner)();

  await DDDRunner.runTask(new Migrate(args));

  DDDRunner._DDD.end();
}

main();