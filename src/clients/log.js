import config from './../config';
import logSymbols from 'log-symbols';
import winston from 'winston';

const debug = (err) => {
	if (config.app_env !== 'production') {
		// can't see enough info here
		winston.level = 'error';
		winston.log(`${JSON.stringify(err, null, 4)}`);
	}
}

const activity = (activity) => {
	winston.level = 'info';
	winston.info(`${logSymbols.info} ----------------- DEBUG\n${JSON.stringify(activity, null, 4)}`);
}

export { debug, activity }
