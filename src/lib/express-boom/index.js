/*
 * Customised version of npm package 'express-boom' with modified error handling and logging
 */
import boom from 'boom';
import config from './../../config';
import { v4 } from 'node-uuid';
import logSymbols from 'log-symbols';
import uuidBase64 from 'uuid-base64';
import winston from 'winston';
import _ from 'lodash';

const helperMethods = ['wrap', 'create'];

export default () => {
    return (req, res, next) => {
        if (res.boom) throw new Error('boom already exists on response object');
            res.boom = {};
            Object.keys(boom).forEach((key) => {
                if (typeof boom[key] !== 'function') return;
                if (helperMethods.indexOf(key) !== -1) {
                    res.boom[key] = function () {
                        return boom[key].apply(boom, arguments);
                    };
                } else {
                    res.boom[key] = function () {
                        let boomed = boom[key].apply(boom, arguments);
                        let uid = uuidBase64.encode(v4());
                        
                        console.log('%s %s API %s request error', logSymbols.error, config.community, config.api_version, uid);
                        console.log('%s %s %s', logSymbols.info, req.method, req.originalUrl);

                        _.isEmpty(boomed.output.payload) || winston.verbose(`${JSON.stringify(boomed.output.payload, null, 4)}`);
                        _.isEmpty(req.headers) || winston.verbose(`${JSON.stringify(req.headers, null, 4)}`);
                        _.isEmpty(req.query) || winston.verbose(`${JSON.stringify(req.query, null, 4)}`);
                        _.isEmpty(req.params) || winston.verbose(`${JSON.stringify(req.params, null, 4)}`);
                        _.isEmpty(req.body) || winston.verbose(`${JSON.stringify(req.body, null, 4)}`);

                        return res.status(boomed.output.statusCode).json({
                            status_code: boomed.output.payload.statusCode,
                            error: boomed.output.payload.error,
                            message: boomed.output.payload.message,
                            details: boomed.data || undefined,
                            meta: {
                                community: config.community,
                                api_version: config.api_version,
                                uid: uid
                            },
                        });
                    };
                }
            });
            next();
    }
};
