const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

function signToken(id) {
	// create a new jwt using the payload
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	})
}
async function createSendToken(doc, statusCode, req, res) {
	/* sends a response with a new jwt - for users and admins */
	const token = signToken(doc._id)
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
	}
	res.cookie(process.env.JWT_COOKIE_NAME, token, cookieOptions)
	doc.password = undefined
	res.status(statusCode).json({
		status: 'success',
		token,
		data: doc,
	})
}

function getJwt(req, next) {
	/* gets the json web token from header Bearer token or from the cookies */
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1]
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt
	}
	if (!token) {
		throw next(
			new AppError(
				'You are not logged in. Please log in to get access',
				401
			)
		)
	}
	return token
}

async function decodeJwt(token) {
	return promisify(jwt.verify)(token, process.env.JWT_SECRET)
}

//decodeJwt('b13ba751f1a269bbde35d5bf64e1ce6026732c574a008df7945548e720a54a1f').then(d => console.log(d))

function clearJwtCookie(res) {
	// removes the jwt cookie by setting expires to -10 second
	res.cookie(process.env.JWT_COOKIE_NAME, 'logged out', {
		expires: new Date(Date.now() - 10 * 1000),
		httpOnly: true,
	})
}

function createProtectController(Model, userType = 'user') {
	/* 
		creates a protect route handler for admin or user.
	*/
	// user type - 'admin' || 'user'
	return catchAsync(async (req, res, next) => {
		//check if token exists
		let token = getJwt(req, next)
		//validate the token
		const decoded = await decodeJwt(token)
		//check if user still exists

		// currentUser can also be admin
		const currentUser = await Model.findById(decoded.id)
		if (!currentUser) {
			const message =
				userType === 'admin'
					? 'Please login in as admin to use the route'
					: 'The user belonging to this token does no longer exist'
			return next(new AppError(message, 401))
		}
		// check if user changed password after the token was issued
		// not required for admins
		if (
			userType === 'user' &&
			currentUser.changedPasswordAfter.call(currentUser, decoded.iat)
		) {
			return next(
				new AppError(
					'User recently changed password! Please login again',
					401
				)
			)
		}
		// GRANT ACCESS TO PROTECTED ROUTE and continue
		req[userType] = currentUser
		// req.admin or req.user will store logged admin/superadmin or user respectively.
		next()
	})
}

const restrictTo = (...roles) => (req, res, next) => {
	/* blocks all the users from accessing admin/superadmin routes */
	if (!req.admin || !roles.includes(req.admin.role)) {
		return next(
			new AppError(
				'You do not have permission to perform this action',
				403
			)
		)
	}
	next()
}

const addRequiredPrivilege = privilege => (req, res, next) => {
	if (!req.admin || !req.admin.privileges.includes(privilege)) {
		return next(
			new AppError(
				'You do not have permission to perform this action',
				403
			)
		)
	}
	next()
}

module.exports = {
	signToken,
	createSendToken,
	getJwt,
	decodeJwt,
	clearJwtCookie,
	createProtectController,
	restrictTo,
	addRequiredPrivilege,
}
