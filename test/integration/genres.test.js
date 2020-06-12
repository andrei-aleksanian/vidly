const mongoose = require("mongoose");
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../index');

describe('api/genres', () => {
    beforeEach(async () => {
        await Genre.deleteMany({});
    });

    afterEach(async () => {
        await Genre.deleteMany({});
        mongoose.models = {};
        mongoose.modelSchemas = {};
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'}
            ]);

            const res = await request(app).get('/api/genres');
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(2);
            expect(res.body.some( g => g.name === 'genre1')).to.be.ok;
        });
    });

    describe('GET /:id', () => {
        it('should return the given genre', async () => {
            const genre = new Genre({ name: 'genre2'});
            await genre.save();

            const res = await request(app).get('/api/genres/' + genre._id);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name',genre.name);
        });

        it('should return 404 if id is invalid', async () => {
            const res = await request(app).get('/api/genres/1');
            expect(res.status).to.equal(404);
        });

        it('should return 404 if id is not in the database', async () => {
            const id = new mongoose.Types.ObjectId().toHexString();

            const res = await request(app).get('/api/genres/' + id);

            expect(res.status).to.equal(404);
        });
    });
});