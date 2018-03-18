import express from 'express';
import controller from './controller';

const Health = express();

// health
Health.get('/check', controller.healthCheck);

export default Health;