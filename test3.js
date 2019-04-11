
loggerWrapper = require('./lib/LoggerWrapper');
log = loggerWrapper();

// console.log(logger);
log('aaa');
log.info('bbb %s', 'prm');
log.error('ccc');
log.verbose('ddd');

