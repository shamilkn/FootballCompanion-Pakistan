const mongoose = require('mongoose')

const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getDoc = async (Model, params = {}, populateOpts) => {
	try {
		
		//if (!mongoose.isValidObjectId(id)) {
		//	throw (new AppError('Please enter a valid ObjectId', 404))
		//}

		let query = Model.findOne(params)

		if (populateOpts) {
			query = query.populate(populateOpts)
		}
		const doc = await query
		if (!doc) {
			throw (new AppError('No document found with that ID', 404))
		}
		return ({
			status: 'success',
			data: doc,
		})
	}
	catch (err) {
		throw err;
	}
}

exports.getDocs = async (Model, params = {}) => {

	try {
		return Model.find(params)
	}
	catch (err) {
		throw err;
	}

}

exports.getOne = (Model, populateOpts) =>
	catchAsync(async (req, res, next) => {
		const { id } = req.params
		if (!mongoose.isValidObjectId(id)) {
			return next(new AppError('Please enter a valid ObjectId', 404))
		}
		let query = Model.findById(id)
		if (populateOpts) {
			query = query.populate(populateOpts)
		}
		const doc = await query
		if (!doc) {
			return next(new AppError('No document found with that ID', 404))
		}
		res.status(200).json({
			status: 'success',
			data: doc,
		})
	})

exports.getAll = Model =>
	catchAsync(async (req, res, next) => {
		let features = new APIFeatures(Model.find(req.filter), req.query)
			.sort()
			.limitFields()
			.paginate()
		const docs = await features.query
		const totalDocs = await Model.estimatedDocumentCount()
		res.status(200).json({
			status: 'success',
			total: totalDocs,
			results: docs.length,
			data: docs,
		})
	})

exports.createOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body)
		res.status(200).json({
			status: 'success',
			data: doc,
		})
	})

exports.updateOne = Model =>
	catchAsync(async (req, res, next) => {
		const { id } = req.params
		if (!mongoose.isValidObjectId(id) && false) {
			return next(new AppError('Please enter a valid ObjectId', 404))
		}
		const doc = await Model.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
			upsert: true
		})

		if (!doc) {
			return next(new AppError('No document found with that ID', 404))
		}
		res.status(200).json({
			status: 'success',
			data: doc,
		})
	})

exports.deleteOne = Model =>
	catchAsync(async (req, res, next) => {
		const { id } = req.params
		if (!mongoose.isValidObjectId(id)) {
			return next(new AppError('Please enter a valid ObjectId', 404))
		}
		const doc = await Model.findByIdAndDelete(id)
		if (!doc) {
			return next(new AppError('No document found with that ID', 404))
		}
		res.status(200).json({
			status: 'success',
			data: null,
		})
	})
