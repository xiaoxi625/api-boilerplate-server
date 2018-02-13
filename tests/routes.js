var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var dotenv = require('dotenv');
var pgp = require('pg-promise');
var co = require('co');
var v4 = require('node-uuid');
var options = {};
var database = {
    default: {
        connection_string: 'postgres://u4t8khos2g9icj:pdncpugjirlvat7hihdeih83m2m@ec2-52-70-48-181.compute-1.amazonaws.com:5432/dbvhhmg6641mhe?ssl=true',
        host:              'ec2-52-70-48-181.compute-1.amazonaws.com',
        port:              '5432',
        database:          'dbvhhmg6641mhe',
        user:              'u4t8khos2g9icj',
        password:          'pdncpugjirlvat7hihdeih83m2m',
        ssl:               ''
    }};
var defaultDb = pgp()(database.default.connection_string);
describe('Routing', function() {
    var url = 'localhost:5000';
    var auth = 'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjNlYWFlYmUtZmI3OS00NTMxLWIwMDktNjdlOTg4ODBjOWZkIiwiZW1haWwiOiJ4aWFvQGFzZC5jb20iLCJpYXQiOjE0NzA4MDY1Nzh9.sxuEZGvMDYL_KeGMj6PInvYLbLBPy3Vu3tgeVmmEPVbRriXNVun40ZQF7kLdpiv5zY8c3Wd7hLw_n13IEQobp1MB3dbQafU6v_CQBrky4XsHptB1kInLWdWpmG-gGyPMYE-8V9zz6j3DBHarJ4dIgqp3_2zMIN-swsth83sfyhU';
    before(function(done){
        done();
    });
    
    describe('healthCheck', function() {
        it('should return 200，it is basic api to test project running or not', function(done) {
            var param = {};
            request(url)
            .get('/api/v1/health')
            .end(function(err,res) {
                if(err) {
                    throw err;
                }
                res.should.have.property('status',200);
                done();
            })
        });
    });
    describe('message-register',function() {
        it('should return mobile exists', function(done) {
            this.timeout(20000);
            var params = {
                mobile: '0405285025'
            };
            request(url)
                .post('/api/v1/auth/message-register')
                .send(params)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',400);
                done();
            })
        });
/* issue       it('should return validation code', function(done) {
            this.timeout(20000);
            var params = {
                mobile: '0405285025'
            };
            request(url)
                .post('/api/v1/auth/message-register')
                .send(params)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                console.log('---------property-------', res.body);
                res.should.have.property('status',200);
                
                done();
            })
        }); */
    });
    describe('mobile-login',function() {
  /*      it('get validation code, should return 200 and mobile should get validation code', function(done) {
            this.timeout(20000);
            var params = {
                mobile: '0405285025'
            };
            request(url)
                .put('/api/v1/auth/getvalidationcode')
                .send(params)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                done();
            })
        });  */
        it('should return 401 and user not exists', function(done) {
            this.timeout(20000);
            var params = {
                mobile: '0400000001'
            };
            request(url)
                .put('/api/v1/auth/getvalidationcode')
                .send(params)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',401);
                done();
            })
        });
        it('mobile login, should return login success', function(done) {
            this.timeout(20000);
            let sql = "select mobile_hash from users where mobile = '0405285025' ";
            var hash_code = '';
            co(function *() {
                var res = yield defaultDb.any(sql)
                        .then((userRecodes) => {
                            if(userRecodes != null && userRecodes != undefined){
                                hash_code = userRecodes;
                            }
                            return userRecodes;
                        }, (userRecodes) => {
                            console.log('rejected ');
                            console.log(userRecodes);
                            return userRecodes;
                        })
                        .catch((err) => {
                            return err;
                        });
                var b = new Buffer(hash_code[0].mobile_hash,'base64');
                var decodeValue = b.toString();
                var params = {
                    mobile: '0405285025',
                    mobile_hash: decodeValue
                };
                request(url)
                    .post('/api/v1/auth/mobile-login')
                    .send(params)
                    .end(function(err,res) {
                        if (err) {
                            throw err;
                        }
                   res.should.have.property('status',201);
                   done();
               })
            })
       }); 
    });
    describe('List module', function() {
        it('List banks, should return 200 and bank lists', function(done) {
            request(url)
                .get('/api/v1/lists/banks')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.length.should.greaterThan(1);
                done();
            })
        });
        it('List assets, should return 200 and assets objects', function(done) {
            request(url)
                .get('/api/v1/lists/assets')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.assets.should.type('object');
                done();
            })
        });
        it('List liabilities, should return 200 and liabilities objects', function(done) {
            request(url)
                .get('/api/v1/lists/liabilities')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.liabilities.should.type('object');
                done();
            })
        });
        it('List incomes, should return 200 and incomes objects', function(done) {
            request(url)
                .get('/api/v1/lists/incomes')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.incomes.should.type('object');
                done();
            })
        });
        it('List expenses, should return 200 and expenses objects', function(done) {
            request(url)
                .get('/api/v1/lists/expenses')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.expenses.should.type('object');
                done();
            })
        });
        it('List one assetsType, should return 200 and assetsType details', function(done) {
            request(url)
                .get('/api/v1/lists/assets/asset_business_equity')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.assets.should.type('object');
                done();
            })
        });
        it('find a not exist type, should return 404 and not found', function(done) {
            request(url)
                .get('/api/v1/lists/assets/aa')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',404);
                res.body.error.should.equal('Not Found');
                done();
            })
        });
        it('List one liabilityType, should return 200 and liabilityType details', function(done) {
            request(url)
                .get('/api/v1/lists/liabilities/liability_overdraft')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.liabilities.should.type('object');
                done();
            })
        });
        it('find a not exist type, should return 404 and not found', function(done) {
            request(url)
                .get('/api/v1/lists/liabilities/aa')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',404);
                res.body.error.should.equal('Not Found');
                done();
            })
        });
        it('List one incomeType, should return 200 and incomeType details', function(done) {
            request(url)
                .get('/api/v1/lists/incomes/payg_matenity_leave')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.incomes.should.type('object');
                done();
            })
        });
        it('find a not exist type, should return 404 and not found', function(done) {
            request(url)
                .get('/api/v1/lists/incomes/aa')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',404);
                res.body.error.should.equal('Not Found');
                done();
            })
        });
        it('List one expenseType, should return 200 and expenseType details', function(done) {
            request(url)
                .get('/api/v1/lists/expenses/liability_lease')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.expenses.should.type('object');
                done();
            })
        });
        it('find a not exist type, should return 404 and not found', function(done) {
            request(url)
                .get('/api/v1/lists/expenses/aa')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',404);
                res.body.error.should.equal('Not Found');
                done();
            })
        });
    });
    describe('Applications tests', function() {
        it('find specific application, should return 200 and application details', function(done) {
            this.timeout(20000);
            request(url)
                .get('/api/v1/applications/8c23771c-db39-4554-a7df-b79d48c1df37')
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.application.should.type('object');
                done();
            })
        });
        it('update application employ type, should return 204', function(done) {
            this.timeout(20000);
            var body = {
                employment_type: 'Full Time - PAYG'
            }
            request(url)
                .put('/api/v1/applications/8c23771c-db39-4554-a7df-b79d48c1df37/employment')
                .send(body)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',204);
                done();
                })
        });
        it('update an application based on application uuid, should return 200', function(done) {
            this.timeout(20000);
            var body = {
                credit_history:     "Average - Paid default <$1000",
                lender_name:        "",
                lender_rate:        "",
                loan_type:          "New Purchase",
                loan_value:         "300000",
                property_address:   "NOT SURE",
                property_use:       "Owner Occupied",
                repayment_method:   "Principle & Interest",
                security_value:     "600000"
            }
            request(url)
                .put('/api/v1/applications/8c23771c-db39-4554-a7df-b79d48c1df37')
                .send(body)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                done();
                })
        });
        it('update an application with wrong body , should return 400 and Validation failed', function(done) {
            this.timeout(20000);
            var body = {
                credit_history:     "Average - Paid default <$1000"
            }
            request(url)
                .put('/api/v1/applications/8c23771c')
                .send(body)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',400);
                res.body.error.should.equal('Bad Request');
                done();
                })
        });
/*        it('create an application, should return 200 and the application object.', function(done) {
            this.timeout(20000);
            var body = {
                
            }
            request(url)
                .post('/api/v1/applications/')
                .send(body)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.application.should.type('object');
                done();
                })
        }); */
    });
    describe('User and applicant tests', function(){
        var fake_user_uuid = null;
        var fake_application_uuid = "5679761b-0117-4398-b9d1-b3e8af8d01c1";
        it('create applicant based on application, should return 200 and applicant uuid', function(done) {
            this.timeout(20000);
            var createUrl = '/api/v1/applications/' + fake_application_uuid + '/users';
            var body = {
                user_uuid:  fake_user_uuid
            }
            request(url)
                .post(createUrl)
                .send(body)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                fake_user_uuid = res.body.data.applicant_uuid;
                res.body.data.applicant_uuid.should.be.a.String;
                done();
                })
        });
        it('get user(applicant), should return applicants infomation if the application has some applicants and 200 status code', function(done) {
            this.timeout(20000);
            var getUrl = '/api/v1/applications/' + fake_application_uuid + '/users?transformer=react_users'
            request(url)
                .get(getUrl)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                done();
                })
        });
        it('update applicant, should return 204', function(done) {
            this.timeout(20000);
            var updateUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid;
            var body = {
                annual_profit:  null,
                business_name:  null,
                credit_history: null,
                current_employer_name:  null,
                current_job_start_date: null,
                current_payment_frequency:  null,
                current_role:   null,
                current_salary_amount:  null,
                dependant_1_age:    null,
                dependant_2_age:    null,
                dependant_3_age:    null,
                dependant_4_age:    null,
                dependant_5_age:    null,
                dob:    null,
                e_consent:  null,
                email:  null,
                employment_period:  null,
                employment_type:    null,
                first_name:     "qwe",
                id:     1,
                last_employment_name:   null,
                last_employment_start_date:     null,
                last_name:  "qwe",
                marital_status:     null,
                middle_name:    null,
                mobile:     null,
                no_of_dependant:    null,
                previous_employer_name:     null,
                previous_job_start_date:    null,
                previous_payment_frequency: null,
                previous_role:      null,
                previous_salary_amount:     null,
                resident_status:    null,
                salary:     null,
                self_employment_period:     null,
                tax_returns:    null,
                title:  "Mr",
                uuid:   fake_user_uuid

            }
            request(url)
                .put(updateUrl)
                .send(body)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                res.should.have.property('status',204);
                done();
            })
        });
        it('delete applicant, should return 200 successful', function(done) {
            this.timeout(10000);
            var deleteUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid;
            request(url)
                .delete(deleteUrl)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                done();
                })
        });
    });
    describe('Income tests', function() {
        var fake_client_uuid = v4();
        var fake_user_uuid = "63eaaebe-fb79-4531-b009-67e98880c9fd";
        var fake_application_uuid = "4864f41a-8e22-409d-8b0e-7d2be82d271b";
        it('create user income based on application, should return 200 and income data,client uuid should be generated from front-end for offline. In this case we fake a client uuid from this test and pass the fake one to the api', function(done) {
            this.timeout(20000);
            var createApiUrl = '/api/v1/applications/' + fake_application_uuid + '/incomes';
            var body = {
                amount:     "1111111",
                category:   "disability_support_pension",
                client_uuid:    fake_client_uuid,
                comments:   "ksjdlas",
                frequency:  "fortnightly",
                user_uuid:  fake_user_uuid
            }
            request(url)
                .post(createApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('get income based on application, should return 200 and income data.', function(done) {
            this.timeout(20000);
            var getApiUrl = '/api/v1/applications/' + fake_application_uuid + '/incomes';
            request(url)
                .get(getApiUrl)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                done();
                })
        });
        it('update user income, should return 200', function(done) {
            this.timeout(20000);
            var body = {
                "client_uuid": fake_client_uuid,
                "amount": "50000",
                "category": "family_tax_benefit_a_or_b"
            }
            var updateApiUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid + '/incomes/' + fake_client_uuid;
            request(url)
                .put(updateApiUrl)
                .send(body)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('update user income with wrong uuid, should return 400', function(done) {
            this.timeout(10000);
            var body = {
                "client_uuid": "123321",
                "amount": "50000",
                "category": "family_tax_benefit_a_or_b"
            }
            var updateApiUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid + '/incomes/123321';
            request(url)
                .put(updateApiUrl)
                .send(body)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',400);
                done();
                })
        });
        it('delete income data, should return 200 and income and expense uuid', function(done) {
            this.timeout(20000);
            var deleteApiUrl = '/api/v1/applications/' + fake_application_uuid + '/incomes/' + fake_client_uuid;
            request(url)
                .delete(deleteApiUrl)
                .set('Authorization',auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });  
    });
    describe('Expense tests', function() {
        var fake_client_uuid = v4();
        var fake_user_uuid = "63eaaebe-fb79-4531-b009-67e98880c9fd";
        var fake_application_uuid = "4864f41a-8e22-409d-8b0e-7d2be82d271b";
        it('create user expense based on application, should return 200 and income data', function(done) {
            this.timeout(20000);
            var createApiUrl = '/api/v1/applications/' + fake_application_uuid + '/expenses';
            var body = {
                amount:     "2000",
                category:   "liability_hecs",
                client_uuid:    fake_client_uuid,
                comments:   "testacf",
                frequency:  "fortnightly",
                user_uuid:  fake_user_uuid
            }
            request(url)
                .post(createApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('get user expense, should return 200 and expense data', function(done) {
            this.timeout(20000);
            var getApiUrl = '/api/v1/applications/' + fake_application_uuid + '/expenses';
            request(url)
                .get(getApiUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('update user expense, should return 200 and the updated data', function(done){
            this.timeout(20000);
            var updateApiUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid + '/expenses/' + fake_client_uuid;
            var body = {
                "client_uuid": fake_client_uuid,
                "amount": "40000",
                "category": "childcare_and_school_fees"
            }
            request(url)
                .put(updateApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('update user expense with wrong uuid, should return 400', function(done){
            this.timeout(10000);
            var updateApiUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid + '/expenses/123321';
            var body = {
                "client_uuid": "123321",
                "amount": "40000",
                "category": "childcare_and_school_fees"
            }
            request(url)
                .put(updateApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',400);
                done();
                })
        });
        it('delete user expense, should return 200 and expense uuid', function(done) {
            this.timeout(20000);
            var deleteApiUrl = '/api/v1/applications/' + fake_application_uuid + '/expenses/' + fake_client_uuid;
            request(url)
                .delete(deleteApiUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
    });
    describe('Asset tests', function() {
        var fake_client_uuid = v4();
        var fake_user_uuid = "63eaaebe-fb79-4531-b009-67e98880c9fd";
        var fake_application_uuid = "4864f41a-8e22-409d-8b0e-7d2be82d271b";
        it('create user asset based on application, should return 200 and asset data', function(done) {
            this.timeout(20000);
            var createApiUrl = '/api/v1/applications/' + fake_application_uuid + '/assets';
            var body = {
                category:   "asset_real_estate",
                client_uuid: fake_client_uuid,
                evidence_of_tenancy: null,
                full_address: null,
                primary_purpose: "Owner Occupied",
                rental_income: null,
                to_be_purchased: null,
                type: null,
                used_as_security: null,
                value: 100000,
                value_basis: null,
                zoning: "Residential"
            }
            request(url)
                .post(createApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('get user asset, should return 200 and expense data', function(done) {
            this.timeout(20000);
            var getApiUrl = '/api/v1/applications/' + fake_application_uuid + '/assets';
            request(url)
                .get(getApiUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('update user asset, should return 200 and the updated data', function(done) {
            this.timeout(10000);
            var updateApiUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid + '/assets/' + fake_client_uuid;
            var body = {
                client_uuid: fake_client_uuid,
                create_from_custom_clone_button: false,
                institution: "acf",
                limit: null,
                value: 15000
            }
            request(url)
                .put(updateApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('update user asset with wrong uuid, should return 400', function(done) {
            this.timeout(10000);
            var updateApiUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid + '/assets/123321';
            var body = {
                client_uuid: '123321',
                value: 15000
            }
            request(url)
                .put(updateApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',400);
                done();
                })
        });
        it('delete user asset, should return 200 and asset uuid', function(done) {
            this.timeout(10000);
            var deleteApiUrl = '/api/v1/applications/' + fake_application_uuid + '/assets/' + fake_client_uuid;
            request(url)
                .delete(deleteApiUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
    });
    describe('Liability tests', function() {
        var fake_client_uuid = v4();
        var fake_user_uuid = "63eaaebe-fb79-4531-b009-67e98880c9fd";
        var fake_application_uuid = "4864f41a-8e22-409d-8b0e-7d2be82d271b";
        it('create user liability based on application, should return 200 and liability data', function(done) {
            this.timeout(10000);
            var createApiUrl = '/api/v1/applications/' + fake_application_uuid + '/liabilities';
            var body = {
                category: "liability_store_card",
                clearing_from_this_loan: null,
                client_uuid: fake_client_uuid,
                current_balance: 2000,
                limit: 3000,
                repayment_frequency: "monthly",
                repayments: 1000
            }
            request(url)
                .post(createApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('get user liability,should return 200 and liability data', function(done) {
            this.timeout(10000);
            var getApiUrl = '/api/v1/applications/' + fake_application_uuid + '/liabilities';
            request(url)
                .get(getApiUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('update user liability, should return 200 and updated data', function(done) {
            this.timeout(10000);
            var updateApiUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid + '/liabilities/' + fake_client_uuid;
            var body = {
                client_uuid: fake_client_uuid,
                current_balance: null,
                description: null,
                evidence_of_tenancy: false,
                frequency: null,
                gross_amount: 0,
                institution: "acf",
                limit: 500,
                value: 5000
            }
            request(url)
                .put(updateApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('update user liability with wrong uuid, should return 400', function(done) {
            this.timeout(10000);
            var updateApiUrl = '/api/v1/applications/' + fake_application_uuid + '/users/' + fake_user_uuid + '/liabilities/123321' ;
            var body = {
                client_uuid: '123321',
                value: 5000
            }
            request(url)
                .put(updateApiUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',400);
                done();
                })
        });
        it('delete user liability, should return 200 and liability uuid', function(done) {
            this.timeout(10000);
            var deleteApiUrl = '/api/v1/applications/' + fake_application_uuid + '/liabilities/' + fake_client_uuid;
            request(url)
                .delete(deleteApiUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
    });
    describe('Required documents tests', function() {
        var fake_application_uuid = "4864f41a-8e22-409d-8b0e-7d2be82d271b";
        var fake_doc_uuid = "2bdfe3e9-bd8c-492e-b097-b6b8007cfa28";
        it('find all required documents based on the application',function(done) {
            this.timeout(10000);
            var getAllRequiredDocUrl = '/api/v1/applications/' + fake_application_uuid + '/documents';
            request(url)
                .get(getAllRequiredDocUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('find single required document based on the application, should return 200 and document data', function(done) {
            this.timeout(10000);
            var getSingleRequiredDocUrl = '/api/v1/applications/' + fake_application_uuid + '/documents/' + fake_doc_uuid;
            request(url)
                .get(getSingleRequiredDocUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                res.body.data.should.type('object');
                done();
                })
        });
        it('find single required document with wrong doc uuid, should return 404 and document data cannot be found', function(done) {
            this.timeout(10000);
            var getSingleRequiredDocUrl = '/api/v1/applications/' + fake_application_uuid + '/documents/123321';
            request(url)
                .get(getSingleRequiredDocUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',404);
                done();
                })
        });
        it('generate required documents based on application, should return 204, update opportunity table, set generate required doc true', function(done) {
            this.timeout(10000);
            var generateRequiredDocUrl = '/api/v1/applications/' + fake_application_uuid + '/documents/generate';
            request(url)
                .put(generateRequiredDocUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',204);
                done();
                })
        });
        //
        //save required doc to S3
        //
        it('update note based on doc uuid, should return 204 successful', function(done) {
            this.timeout(10000);
            var updateNoteUrl = '/api/v1/applications/' + fake_application_uuid + '/note/' + fake_doc_uuid;
            var body = {
                noteText: 'AUTO TEST',
                status: 'updated'
            }
            request(url)
                .put(updateNoteUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',204);
                done();
                })
        });
        it('update note with wrong doc uuid, should return 404 not found', function(done) {
            this.timeout(10000);
            var updateNoteUrl = '/api/v1/applications/' + fake_application_uuid + '/note/' + '123321';
            var body = {
                noteText: 'AUTO TEST',
                status: 'updated'
            }
            request(url)
                .put(updateNoteUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',404);
                done();
                })
        });
    });
    describe('Jumio tests', function() {
        var reference_code = '';
        var fake_application_uuid = "4864f41a-8e22-409d-8b0e-7d2be82d271b";
        var fake_doc_uuid = "2bdfe3e9-bd8c-492e-b097-b6b8007cfa28";
        it('send request to Jumio and get token', function(done) {
            this.timeout(10000);
            var jumioUrl = '/api/v1/jumio/jumio_token';
            var body = {
                JUMIO_API_SECRET: "KEKgsp0yDS26VYekgHzwpiEU48Q2jZZi",
                JUMIO_API_TOKEN: "3e3926b9-36ba-451a-9bef-0fc9a3113be3",
                JUMIO_URL: "https://netverify.com/api/netverify/v2/initiateNetverify",
                authorizationTokenLifetime: "0",
                callbackEmail: "your-callback@email.com",
                callbackUrl: "https://www.your-site.com/callback",
                clientIp: "xxx.xxx.xxx.xxx",
                country: "USA",
                customerId: "CUSTOMERID",
                dob: "1990-01-01T22:00:00Z",
                enabledFields: "idNumber,idFirstName,idLastName,idDob,idExpiry,idUsState",
                errorUrl: "https://www.your-site.com/error",
                expiry: "2013-07-25T22:00:00Z",
                firstName: "FIRSTNAME",
                idType: "DRIVING_LICENSE",
                lastName: "LASTNAME",
                locale: "en",
                merchantIdScanReference: "YOURSCANREFERENCE",
                merchantReportingCriteria: "YOURREPORTINGCRITERIA",
                number: "NUMBER",
                successUrl: "https://www.your-site.com/sucess",
                usState: "TX"
            }
            request(url)
                .post(jumioUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                reference_code = res.body.data.jumioIdScanReference;
                res.body.data.should.type('object');
                done();
                })
        });
        it('update jumio reference id for required doc, should return 204 update successful', function(done) {
            this.timeout(10000);
            var jumioUrl = '/api/v1/applications/' + fake_application_uuid + '/jumio/' + fake_doc_uuid;
            var body = {
                reference_no: reference_code,
                status: 'updated'
            }
            request(url)
                .put(jumioUrl)
                .send(body)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',204);
                done();
                })
        });
    });
    describe('Product tests', function(){
        it('product api test, should return 200 successful and list of products data', function(done) {
            this.timeout(20000);
            var productUrl = '/api/v1/products';
            request(url)
                .get(productUrl)
                .set('Authorization', auth)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                res.should.have.property('status',200);
                done();
                })
        })
    });
});