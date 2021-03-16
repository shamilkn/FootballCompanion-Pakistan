const Admin = require('../models/admin.model')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')
const {
	getJwt,
	decodeJwt,
	createSendToken,
	createProtectController,
} = require('../utils/auth')

exports.protect = createProtectController(Admin, 'admin')

exports.getCount = catchAsync(async function (req, res, next) {
	
	const total = await Admin.countDocuments()
	const admins = await Admin.countDocuments({role: 'admin'})
	const superAdmins = await Admin.countDocuments({role: 'superadmin'})

	return res.send({total, admins, superAdmins})

})

async function createSuperAdmin(res, data) {
	const superAdmin = await Admin.create(data)
	res.status(200).json({
		status: 'success',
		message: 'Super Admin created successfully',
		data: superAdmin,
	})
}

exports.adminLogin = catchAsync(async (req, res, next) => {
	// issue the jwt if proper username and password is supplied
	const { username, password } = req.body
	if (!username || !password) {
		return next(new AppError('Please provide username and password', 400))
	}
	const admin = await Admin.findOne({ username }).select('+password')

	if (!admin || !(await admin.correctPassword(password, admin.password))) {
		return next(new AppError('Incorrect username or password', 401))
	}
	createSendToken(admin, 200, req, res)
})

exports.getMe = (req, res, next) => {
	req.params.id = req.admin.id
	next()
}

exports.filterAdmins = (req, res, next) => {
	//req.filter = { role: 'admin' }
	next()
}
exports.createAdmin = catchAsync(async function (req, res, next) {
	const {
		name,
		username,
		email,
		password,
		role,
		superAdminKey,
		privileges,
	} = req.body

	// 1. You can create a new superadmin if properties: role and superAdminKey exists
	if (role && superAdminKey) {
		if (
			role === 'superadmin' &&
			superAdminKey === process.env.SUPERADMIN_KEY
		) {
			return createSuperAdmin(res, {
				name,
				username,
				email,
				password,
				role,
			})
		} else {
			return next(
				new AppError('Role or Super Admin Key is not valid', 400)
			)
		}
	}

	// 2. a) You can create an admin if properties: role, superAdminKey does not exist
	// 2. b) Superadmin must be logged in while creating
	else {
		/* 
            Get the current logged admin first, if he is a superadmin, 
            then allow creation of a new admin 
        */
		const token = getJwt(req, next)
		const decoded = await decodeJwt(token)
		const loggedAdmin = await Admin.findById(decoded.id)
		if (loggedAdmin.role === 'superadmin') {
			const newAdmin = await Admin.create({
				name,
				username,
				email,
				password,
				role,
				privileges: privileges || [],
			})
			return res.status(200).json({
				status: 'success',
				message: 'Admin created successfully',
				data: newAdmin,
			})
		} else {
			return next(
				new AppError('Only superadmins can create an admin', 400)
			)
		}
	}
})

exports.deleteAdmin = (req, res, next) => {
	// ensures that superadmin does not delete his account using this route
	if (req.params.id === req.admin.id) {
		return next(
			new AppError('Please use /admins/me route to delete your account')
		)
	}
	next()
}

exports.updateAdmin = catchAsync(async (req, res, next) => {

	delete req.body.password;
	const data = await factory.updateOne(Admin);
	return res.status(200).send({
		status: 'success',
		data
	})

})

exports.getAll = catchAsync(async (req, res, next) => {

	return factory.getAll(Admin);

});

Admin.countDocuments().then(async (length) => {
	if (length === 0) {
		await createSuperAdmin({
			status: null,
			send: null
		}, {
			name: 'Default Admin',
			username: process.env.ADMIN_USERNAME,
			email: 'd_admin@d.co',
			password: process.env.ADMIN_PASS,
			role: 'superadmin',
		});
		console.log(`Superadmin created with username ${process.env.ADMIN_USERNAME} and password ${process.env.ADMIN_PASS}`)
	}
})