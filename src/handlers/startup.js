import config from './../config';
import logSymbols from 'log-symbols';
import babelCoreRegister from 'babel-core/register';
import babelPolyfill from 'babel-polyfill';
import co from 'co';
import ora from 'ora';

const start = (app) => {
  /*
   * Start the server
   */
  listen(app);
}

/*
 * Start the server
 */
const listen = (app) => {
    try {
        checkConfiguration();
        app.listen(config.port, (err) => {
            if (err) { console.error(err) };
            console.log(logSymbols.success, 'Application started on port', config.port);
            console.log('-----------------', config.community, config.api_version, '-----------------\n');
        });
    } catch (errors) {
        console.log('\n', '-----------------', 'Configuration errors', '-----------------');
        errors.forEach((err) => {
            console.error(logSymbols.error, err);
        });
    }
}

/*
 * Perform startup checks
 */
const checkConfiguration = () => {
    let errors = [];
    // config.community || errors.push('config.community');
    // config.app_key || errors.push('config.app_key');
    // config.encryption.private_key || errors.push('config.encryption.private_key');
    // config.encryption.public_key || errors.push('config.encryption.public_key');
    config.port|| errors.push('config.port');
    if (errors.length) {
        throw(errors);
    }
}

export { start }
