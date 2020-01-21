'use strict'

const _ = require('lodash');
const typeOf = require('typeof');

module.exports = class MessageBag {

    constructor(messages = {}) {
        this._messages = {};
        this._format = ':message';
        // Object.keys(messages).forEach(function(key) {
        for(const key in messages) {
            const value = Array.from(messages[key]);
            this._messages[key] = this.array_unique(value);
        }
    }

    array_unique(array) {
        return array.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
    }

    keys() {
        return Object.keys(this._messages);
    }

    add(key, message) {
        if(this.isUnique(key, message)) {
            if(this._messages[key])
                this._messages[key].push(message)
            else
                this._messages[key] = [message];
        }
        return this;
    }

    isUnique(key, message) {
        if(!(key in this._messages)) return true;
        if(!(this._messages[key].includes(message))) return true;
        return false;
    }

    merge(messages) {
        if(typeOf(messages) === 'messagebag')
            messages = messages.getMessages();
        this._messages = _.mergeWith(this._messages, messages, (obj, src) => {
            if (_.isArray(obj)) {
                return obj.concat(src);
            }
        });
        return this;
    }

    has(key) {
        if(this.isEmpty())
            return false;
        if(key === null)
            return this.any();
        let keys = key;
        if(typeOf(key) !== 'array')
            keys = arguments;
        for(let key of keys) {
            if(this.first(key) === '')
                return false;
        }
        return true;
    }

    hasAny(keys = []) {
        if(typeOf(keys) !== 'array')
            keys = arguments;
        for(let key of keys) {
            console.log(key);
            if(this.has(key))
                return true;
        }
        return false;
    }

    first(key = null, format = null) {
        let messages;
        if(key === null)
            messages = this.all(format)
        else
            messages = this.get(key, format);
        const firstMessage = _.defaultTo(_.first(messages), '');
        if(typeOf(firstMessage) === 'array')
            return _.first(firstMessage)
        else
            return firstMessage;
    }

    get(key, format = null) {
        if((key in this._messages))
            return this.transform(this._messages[key], this.checkFormat(format), key);
        if(key.indexOf('*') !== -1)
            return this._getMessagesForWildcardKey(key, format);
        return [];
    }

    _getMessagesForWildcardKey(key, format) {
        let messages = {};
        for(const messageKey in this._messages) {
            if(this._Stris(key, messageKey))
                messages[messageKey] = this.transform(this._messages[messageKey], this.checkFormat(format), messageKey);
        }
        let all = [];
        for(const key in messages) {
            all = all.concat(messages[key]);
        }
        return all;
    }

    _Stris(pattern, value) {
        pattern = this._preg_quote(pattern, '#');
        pattern = pattern.replace('\\*', '.*');
        const regexp = new RegExp(pattern);
        if(value.match(regexp))
            return true;
        return false;
    }

    _preg_quote(str, delimiter) {
        return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    }

    all(format = null) {
        format = this.checkFormat(format);
        let all = [];
        for(const key in this._messages) {
            all = all.concat(this.transform(this._messages[key], format, key));
        }
        return all;
    }

    unique(format = null) {
        return _.uniq(this.all(format));
    }

    transform(messages, format, messageKey) {
        return _.map(messages, (message) => {
            let retStr = format;
            retStr = retStr.replace(':message', message);
            retStr = retStr.replace(':key', messageKey);
            return retStr;
        });
    }

    checkFormat(format) {
        if(format !== null)
            return format
        else
            return this._format
    }

    messages() {
        return this._messages;
    }

    getMessages() {
        return this.messages();
    }

    getMessageBag() {
        return this;
    }

    setFormat(format = ':message') {
        this._format = format;
        return this;
    }

    getFormat() {
        return this._format;
    }

    isEmpty() {
        return ! (this.any());
    }

    isNotEmpty() {
        return this.any();
    }

    any() {
        return this.count() > 0;
    }

    count() {
        let count = 0;
        for(const key in this._messages) {
            count += this._messages[key].length;
        }
        return count;
    }

    toArray() {
        return this.getMessages();
    }

    jsonSerialize() {
        return this.toArray();
    }

    toJson(options = 0) {
        // return json_encode($this->jsonSerialize(), $options);
        return JSON.stringify(this.jsonSerialize());
    }

    toString() {
        return this.toJson();
    }

}
