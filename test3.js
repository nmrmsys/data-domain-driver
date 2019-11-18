
loggerWrapper = require('./lib/LoggerWrapper');
log = loggerWrapper({level:'debug'});
// log.level = 'error';
log('aaa');
log.info('bbb %s', 'prm');
log.error('ccc');
log.verbose('ddd');
log.debug('eee');
console.log(log.level);
