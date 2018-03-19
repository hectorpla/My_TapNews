var should = require("should");
var mongoose = require('mongoose');
var User = require("../models/user");
var db;

describe('User', function() {

    before(function(done) {
        db = mongoose.connect(require('../config/config').MongodbUrl);
            done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function(done) {
        var user = new User({
            email: '12345@123.com',
            password: 'testy'
        });

        user.save(function(error) {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    it('find a user by username', function(done) {
        User.findOne({ email: '12345@123.com' }, function(err, user) {
            user.email.should.eql('12345@123.com');
            console.log("   email: ", user.email);
            done();
        });
    });

    afterEach(function(done) {
        User.remove({}, function() {
            done();
        });
     });

});