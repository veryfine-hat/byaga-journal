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
    return params[0];
}

module.exports = logParamsToData