import config from './../../config';
import _ from 'lodash';
import { globalSuccessResponse as success} from './../../handlers/response';
import AWS from 'aws-sdk';
import request from 'request';
import rp from 'request-promise';

export default {
    /**
     * @api {get} /applications/health Retrieve user info with side loading
     * @apiName getUsers
     * @apiGroup Applications
     */
    healthCheck: (req, res) => {
        return res.json(success('health'));
    },
}