const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const app = require('../../index');
const request = require('supertest')(app);
const expect = require('chai').expect;
const mongoose = require('mongoose');
const debug = require('debug')('app:test/integration/returns');

describe('/api/returns/', () => {
    let rental;
    let token = '';
    let rentalId = '';

    beforeEach(async () => {
        rentalId = new mongoose.Types.ObjectId().toHexString();
        token = new User().generateAuthToken();

        const customerId = new mongoose.Types.ObjectId().toHexString();
        const movieId = new mongoose.Types.ObjectId().toHexString();

        rental = new Rental({
            _id: rentalId,
            movie: {
                _id: movieId,
                title: "Interstellar",
                dailyRentalRate: 0.99
            },
            customer: {
                _id: customerId,
                name: '12345',
                phone: '1234567890'
            }
        });
    });

    afterEach(async () => {
        await Rental.deleteMany({});
        mongoose.models = {};
        mongoose.modelSchemas = {};
    });

    const exec = () => {
        return request
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({rentalId});
    };

    describe("POST", () => {
        it("should return 401 if user is not logged in", async () => {
            token = '';

            const res = await exec();

            expect(res.status).to.equal(401);
        });

        it("should return 400 if rentalId is not provided", async () => {
            rentalId = '';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it("should return 404 if rental is not found", async () => {
            await rental.save();
            rentalId = new mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).to.equal(404);
        });

        it("should return 400 if rental already processed", async () => {
            rental.returnedDate = Date.now();
            await rental.save();

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it("should return 200 if rental is returned fine", async () => {
            await rental.save();

            const res = await exec();

            expect(res.status).to.equal(200);
        });

        it("should return save returned date to the database", async () => {
            await rental.save();

            await exec();
            const result = await Rental.findById(rentalId);
            const diff = new Date() - result.returnedDate;
            expect(diff).to.be.gt(0);
        });

        it("should return the rental after 200 response", async () => {
            await rental.save();

            const res = await exec();

            expect(res.status).to.equal(200);
            expect(res.body).to.have.keys(['customer', 'movie', '_id', '__v', 'returnedDate']);
        });
    });

});