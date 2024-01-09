import {normalizePropertyName} from './normalize-property-name'
import { StructuredLog } from './StructuredLog'

export function logParamsToData(params: string[]|[StructuredLog]): StructuredLog {
    if (typeof params[0] === 'string') {
        return {
            message: params.join(' ')
        };
    }

    return Object.entries(params[0] || {})
        .reduce((data: StructuredLog, [key, value]) => {
            data[normalizePropertyName(key)] = value;
            return data;
        }, {})
}