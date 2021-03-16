const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const News = require('../models/news.model');
const factory = require('./handlerFactory');

exports.getAll = factory.getAll(News);
exports.getOne = factory.getOne(News);
exports.create = factory.createOne(News);
exports.update = factory.updateOne(News);
exports.delete = factory.deleteOne(News);