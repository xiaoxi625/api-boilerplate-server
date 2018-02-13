import express from 'express';
import controller from './controller';

const Applications = express();

// Applications
Applications.post('/:application_uuid/dealiq', controller.generateDealiqPdf);

export default Applications;
