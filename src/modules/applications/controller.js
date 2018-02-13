import config from './../../config';
import _ from 'lodash';
import { globalSuccessResponse as success} from './../../handlers/response';
import AWS from 'aws-sdk';
import request from 'request';
import rp from 'request-promise';

export default {
    /**
     * @api {get} /applications/:application_uuid/users Retrieve user info with side loading
     * @apiName getUsers
     * @apiGroup Applications
     */
    generateDealiqPdf: (req, res) => {
        //TODO
        console.log('---get it----');
        return res.json(success('response'));
    },
}
