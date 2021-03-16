const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tournament = require('../models/tournament.model');
const factory = require('./handlerFactory');

exports.getAll = factory.getAll(Tournament);
exports.getOne = factory.getOne(Tournament);
exports.create = factory.createOne(Tournament);
exports.update = factory.updateOne(Tournament);
exports.delete = factory.deleteOne(Tournament);