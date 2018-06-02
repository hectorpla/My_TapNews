const expect = require('chai').expect;
const sinon  = require('sinon');
const mongoose = require('mongoose');
const request = require('request');

const userModel = require(`${__dirname}/../../models/user`);

require('dotenv').config({path: `${__dirname}/../../.env`}); // mind the coupling with preload script
const host = `http://localhost:${process.env.PORT}`;

// use this test to make the server easier to test (replacing postman)
describe("Auth API", () => {
    let SOME_EMAIL = "some@email.com";
    let SOME_PASSWORD = "password";
    const REQUEST_HEADERS = {
        'Content-Type': 'application/json'
    }

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

    describe("Sign-up normal", () => {
        const signupUrl = `${host}/auth/signup`;

        after(() => {
            // TODO: delete db doc
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
                done();
            })
        })

        it("given same info, should fail with status 409 (conflict)", (done) => {
            let body = {email: SOME_EMAIL, password: SOME_PASSWORD};
            request.post(signupUrl, {body: body, json: true}, (err, httpResponse, body) =>{
                expect(err).to.be.null;
                expect(httpResponse.statusCode).to.equal(409);
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
    })

});