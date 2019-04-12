
loggerWrapper = require('./lib/LoggerWrapper');
log = loggerWrapper({level:'debug'});

// console.log(logger);
log('aaa');
log.info('bbb %s', 'prm');
log.error('ccc');
log.verbose('ddd');
log.debug('eee');

