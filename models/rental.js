const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
  movie: new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    dailyRentalRate: {
      type: Number,
      required: true
    }
  }),
  customer: new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  }),
  dueToBeReturned: Date,
  returnedDate: Date,
  overdue: Boolean
}));

function validateRental(rental) {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
    dueToBeReturned: Joi.date(),
    returnedDate: Joi.date(),
    overdue: Joi.boolean()
  };

  return Joi.validate(rental, schema);
}

function validateRentalReturn(rentalReturn) {
  const schema = {
    rentalId: Joi.objectId().required()
  };

  return Joi.validate(rentalReturn, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
exports.validateReturn = validateRentalReturn;