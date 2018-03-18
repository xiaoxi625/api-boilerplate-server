import express from 'express';
import applications from './modules/applications';
import health from './modules/health';
import https from 'https';
import { start } from './handlers/startup';

/*
 * Create express instance and setup middleware
 */
const app = express();

/*
 * Register V1 modules
 */
let v1 = express.Router();

v1.use('/applications', applications);
v1.use('/health', health);

/*
 * Register the API
 */
app.use('/api/v1', v1);


/*
 * Start the server
 */
start(app);
