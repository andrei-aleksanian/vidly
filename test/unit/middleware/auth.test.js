const {User} = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const _ = require('lodash');

describe('auth middleware', () => {
    it('should populate req.user with a payload of a valid JWT', () => {
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const req = {
            header: () => token
        };
        const res = {};
        const next = () => {};

        auth(req, res, next);

        expect(_.pick(req.user,['_id', 'isAdmin'])).to.eql(user);
    });
})
