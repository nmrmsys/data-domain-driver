'use strict'

const _ = require('lodash');

module.exports = class WebApi {

    constructor(global_config) {
        if (typeof global_config == 'undefined'){
            const nc = require('config');
            global_config = nc.util.toObject(nc.get('webapi'));
        }
        this._global_config = global_config;
        this._axios = require('axios').create(global_config.config);
    }

    async call(apiName, params = {}, config = {}) {
        const api_config = _.defaults(config, this._global_config[apiName]);
        const method = api_config.method || 'get';
        switch (method) {
            case 'post':
            case 'put':
            case 'patch':
                api_config.data = _.defaults(params, config.data, this._global_config[apiName].data);
                break;
            default:
                api_config.params = _.defaults(params, config.params, this._global_config[apiName].params);
                break;
        }
        return this._axios.request(api_config);
    }

}
