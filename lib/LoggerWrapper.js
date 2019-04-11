'use strict'

const _ = require('lodash');

const logLevels = {
    silent: 0,
    crit: 1,    // fatal
    error: 2,   // error
    warn: 3,    // warn
    debug: 4,   // debug
    blank: 5,
    info: 5,    // info
    verbose: 6, // trace
    silly: 7
};

const logMethods = ['crit','error','warn','debug','blank','info','verbose','silly'];

function setupLogFn(logger, config, logAt){
    return function(msg){
        if (logLevels[config.level] < logLevels[logAt]) return;
        // console.log(logAt + ': ' + msg);
        var args = Array.prototype.slice.call(arguments);
        if(_.isString(args[0]) && logAt != 'blank') args[0] = logAt + ': ' + args[0];
        return logger[logAt].apply(logger[logAt], args);
    }
}

module.exports = function(config){
    if(!config) config = {};
    if(!config.level) config.level = 'info';
    const stdout = console.log.bind(console);
    const stderr = console.error.bind(console);
    let logger = {
        crit: stderr,
        error: stderr,
        warn: stdout,
        debug: stderr,
        blank: stdout,
        info: stdout,
        verbose: stdout,
        silly: stdout
    };
    if(config.logger) {
        const customLogger = config.logger;
        const nullLogger = function() {};
        logger.crit = customLogger.crit || customLogger.fatal || customLogger.error || nullLogger;
        logger.error = customLogger.error || nullLogger;
        logger.warn = customLogger.warn || customLogger.error || nullLogger;
        logger.debug = customLogger.debug || nullLogger;
        logger.blank = customLogger.blank || nullLogger;
        logger.info = customLogger.info || nullLogger;
        logger.verbose = customLogger.verbose || customLogger.trace || nullLogger;
        logger.silly = customLogger.silly || nullLogger;
    }

    const wrapper = setupLogFn(logger, config, 'blank');
    logMethods.forEach(function(logAt) {
        wrapper[logAt] = setupLogFn(logger, config, logAt);
    });
    
    wrapper._logger = logger;

    return wrapper;
}