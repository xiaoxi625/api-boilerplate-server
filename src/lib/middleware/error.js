import config from './../../config';
import logSymbols from 'log-symbols';
import { debug } from './../../clients/log';

/*
 * Global error middleware
 */
const globalErrorMiddleware = (err, req, res, next) => {
    if (err) {
        console.error(err);
        if (err instanceof SyntaxError) {
            return res.boom.badRequest('Syntax error check your request payload');
        }
        if (err.code === 'credentials_required') {
            return res.boom.unauthorized('No authorization token was found');
        }
        if (err.code === 'revoked_token') {
        	return res.boom.unauthorized('Token has been revoked or doesn\'t exist');
        }
        if (err.code === 'invalid_token') {
        	return res.boom.unauthorized('Invalid token');
        }
        return res.boom.badImplementation(err.message);
    }
    next();
}

export { globalErrorMiddleware }
