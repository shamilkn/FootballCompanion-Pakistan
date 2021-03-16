const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/user.model')
const factory = require('./handlerFactory')


exports.getAll = factory.getAll(User);

exports.getCount = catchAsync(async function (req, res, next) {
	
	const total = await User.countDocuments()
	const confirmed = await User.countDocuments({emailConfirmed: true})
	const unconfirmed = await User.countDocuments({emailConfirmed: false})

	const last24 = await User.countDocuments({createdAt: {$gte: new Date(Date.now() - 24 * 60 * 60 * 1000)}});
	const lastWeek = await User.countDocuments({createdAt: {$gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}});
	const lastMonth = await User.countDocuments({createdAt: {$gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}});

	return res.send({total, confirmed, unconfirmed, last24, lastWeek, lastMonth})

})

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id
	next()
}
const filterObj = (obj, ...allowedFields) => {
	let filteredObj = {}
	Object.keys(obj).map(key => {
		if (allowedFields.includes(key)) filteredObj[key] = obj[key]
	})
	return filteredObj
}

exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password) {
		return next(
			new AppError(
				'This route is not for password updates. Please use /updateMyPassword',
				400
			)
		)
	}

	const filteredBody = filterObj(
		req.body,
		'firstName',
		'lastName',
		'email',
		'company',
		'website',
		'paypalId',
		'phone',
		'address1',
		'address2',
		'country',
		'state',
		'city',
		'zip'
	)

	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		filteredBody,
		{
			new: true,
			runValidators: true,
		}
	)

	res.status(200).json({
		status: 'success',
		data: updatedUser,
	})
})

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndDelete(req.user.id)
	res.status(200).json({
		status: 'success',
		data: null,
	})
})

exports.getUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
