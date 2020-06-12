const mongoose = require("mongoose");
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../index');

describe('auth middleware', () => {
    let token = '';
    let genre = {};

    const exec = () => {
        return request(app)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send(genre)
    };

    beforeEach(async () => {
        token = new User().generateAuthToken();
        genre.name = 'genre1';
        await Genre.deleteMany({});
    });

    afterEach(async () => {
        await Genre.deleteMany({});
        mongoose.models = {};
        mongoose.modelSchemas = {};
    });

    it('should return 401 if there is no token', async () => {
        token = '';

        const res = await exec();

        expect(res.status).to.equal(401);

    });

    it('should return 400 if token is invalid', async () => {
        token = 'not a valid token';
        const res = await exec();

        expect(res.status).to.equal(400);
    });

    it('should execute next middleware if token is valid', async () => {
        const res = await exec();

        expect(res.status).to.equal(200);
    });
});