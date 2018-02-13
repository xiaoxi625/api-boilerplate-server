import config from './../config';
import { v4 } from 'node-uuid';
import _ from 'lodash';
import logSymbols from 'log-symbols';
import uuidBase64 from 'uuid-base64';
import winston from 'winston';

/*
 * Global success response
 */
const globalSuccessResponse = (data, status, req = null) => {
    let uid = uuidBase64.encode(v4());
    if (req) {
        console.log(`%s %s API %s request success`, logSymbols.success, config.community, config.api_version, uid);
        console.log('%s %s %s', logSymbols.info, req.method, req.originalUrl);
        _.isEmpty(req.user) || winston.verbose(`--------- User\n${JSON.stringify(req.user, null, 4)}`);
        _.isEmpty(req.headers) || winston.verbose(`--------- Headers\n${JSON.stringify(req.headers, null, 4)}`);
        _.isEmpty(req.query) || winston.verbose(`--------- Query\n${JSON.stringify(req.query, null, 4)}`);
        _.isEmpty(req.params) || winston.verbose(`--------- Params\n${JSON.stringify(req.params, null, 4)}`);
        _.isEmpty(req.body) || winston.verbose(`--------- Body\n${JSON.stringify(req.body, null, 4)}`);
    }
    return {
        status_code: status || 200,
        error: null,
        message: null,
        meta: {
            community:   config.community,
            api_version: config.api_version,
            uid:         uid
        },
        data: data
    }
}
export { globalSuccessResponse };
