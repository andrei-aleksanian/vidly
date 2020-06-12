const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const _ = require("lodash");

describe('generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new User(payload);

        const result = user.generateAuthToken();
        const decoded = jwt.verify(result, config.get('jwtPrivateKey'));

        expect(_.pick(decoded, ['_id', 'isAdmin'])).to.eql(payload);
    });
});