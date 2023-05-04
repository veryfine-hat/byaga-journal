const normalizePropertyNames = require('./normalize-property-name')
/**
 * Turn log input args into a structured log object
 * param {Array<string|object>} params - log method input params
 * returns {StructuredLog}
 */
function logParamsToData(params) {
    if (typeof params[0] === 'string') {
        return {
            message: params.join(' ')
        };
    }

    return Object.entries(params[0] || {}).reduce((data, [key, value]) => {
        data[normalizePropertyNames(key)] = value;
        return data;
    }, {})
}

module.exports = logParamsToData