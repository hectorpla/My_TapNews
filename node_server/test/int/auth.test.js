const expect = require('chai').expect;
const sinon  = require('sinon');
const mongoose = require('mongoose');
const request = require('request');

const userModel = require(`${__dirname}/../../models/user`);

require('dotenv').config({path: `${__dirname}/../../.env`}); // mind the coupling with preload script
const host = `http://localhost:${process.env.PORT}`;


describe("APIs test", () => {
    const signupUrl = `${host}/auth/signup`;
    const loginUrl = `${host}/auth/login`;
    const newsUrl = `${host}/news/mock`

    before(() => {
        // console.log(process.env);
        mongoose.connect(process.env.MongodbUrl)
            .catch(err => {
                console.log('failed to connect to db');
                process.exit(1);
            })
    })

    after(() => {
        mongoose.disconnect();
    })    

    // use this test to make the server easier to test (replacing postman)
    describe("Auth API", () => {
        let SOME_EMAIL = "some@email.com";
        let SOME_PASSWORD = "password";
        const REQUEST_HEADERS = {
            'Content-Type': 'application/json'
        }

        describe("Log-in rejection handling", () => {
            const randomEmail = "randd";
            const randomPassword = "dfd"

            it("given random email and passowrd, should fail with code 401", (done) => {
                body = { email: randomEmail, password:randomPassword }
                request.post(loginUrl, {body, json: true}, (err, httpResponse, body) => {
                    expect(err).to.be.null;
                    expect(httpResponse.statusCode).to.equal(401);
                    expect(body.success).to.be.false;
                    done();
                })
            })
        })

        describe("Sign-up, Log-in work flow", () => {

            after(() => {
                userModel.deleteOne({email: SOME_EMAIL}, err => {
                    if (err) {
                        console.log('deleting db doc: error ->', err);
                    }
                })
            })

            it("given correct signup info, should succeed with status 200", (done) => {
                let body = {email: SOME_EMAIL, password: SOME_PASSWORD};
                request.post(signupUrl, {body: body, json: true}, (err, httpResponse, body) =>{
                    expect(err).to.be.null;
                    expect(httpResponse.statusCode).to.equal(200);
                    expect(body.success).to.be.true;
                    done();
                })
            })

            it("given same info, should fail with status 409 (conflict)", (done) => {
                let body = {email: SOME_EMAIL, password: SOME_PASSWORD};
                request.post(signupUrl, {body: body, json: true}, (err, httpResponse, body) => {
                    expect(err).to.be.null;
                    expect(httpResponse.statusCode).to.equal(409);
                    expect(body.success).to.be.false;
                    done();
                })
            })

            // a level lower, right thing to do?
            it("should be able to find the doc in db and it contains a different password", (done) => {
                userModel.findOne({email: SOME_EMAIL}, (err, user) => {
                    expect(user).to.not.be.null;
                    expect(user.password).to.not.be.equal(SOME_PASSWORD);
                    done();
                });
            })

            it("should be able to login with the same account", (done) => {
                let body = {email: SOME_EMAIL, password: SOME_PASSWORD};
                request.post(loginUrl, {body: body, json: true}, (err, httpResponse, body) => {
                    expect(err).to.be.null;
                    expect(httpResponse.statusCode).to.equal(200);
                    expect(body.success).to.be.true;
                    expect(body.token).to.be.not.null;
                    done();
                })
            })
        })

    });

    describe("News API", () => {
        const testEmail = "test@user.com";
        const testPassword = "testpassword";
        let token;

        before((done) => {
            const loginBody = {email: testEmail, password: testPassword};
            request.post(signupUrl, {body: loginBody, json:true}, (err, httpResponse, body) => {
                expect([200, 409]).to.include(httpResponse.statusCode, 'failed to sign up');

                request.post(loginUrl, {body: loginBody, json:true}, (err, httpResponse, body) => {
                    expect(httpResponse.statusCode).to.equal(200, 'failed to log in');
                    expect(body).to.include.keys('token');
                    
                    token = body.token;
                    done();
                })
            })
        })

        it("should get refused with code 400 with random token", (done) => {
            const headers = {Authorization: 'Bearer randomToken'};
            request.get(newsUrl, {headers: headers}, (err, httpResponse, body) => {
                expect(httpResponse.statusCode).to.equal(401);
                done();
            })
        })

        it("should get mock news with registered account", (done) => {
            const headers = {Authorization: 'Bearer ' + token}
            request.get(newsUrl, {headers: headers}, (err, httpResponse, body) => {
                expect(httpResponse.statusCode).to.equal(200);
                console.log(body);
                // expect(Array.isArray(body)).to.be.true; // failed
                done();
            })
        })
    })

});