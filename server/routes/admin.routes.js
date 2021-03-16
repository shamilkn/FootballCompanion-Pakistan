const express = require('express')
const router = express.Router()

const Admin = require('../models/admin.model')
const adminController = require('../controllers/admin.controller')
const { restrictTo } = require('../utils/auth')
const handlerFactory = require('../controllers/handlerFactory')

// handles creation of admins and superadmins
router.post('/', adminController.createAdmin)
router.get('/c/count', adminController.getCount)

// login admin or superadmin
router.post('/login', adminController.adminLogin)

router.use(adminController.protect)

// returns the profile of the logged admin/superadmin
router.get('/me', adminController.getMe, handlerFactory.getOne(Admin))

/*
 * BELOW ROUTES ARE PROTECTED and Only for superadmins
 */

//router.use(restrictTo('superadmin'))

router.get('/', adminController.filterAdmins, handlerFactory.getAll(Admin))

router.delete(
	'/:id',
	adminController.deleteAdmin,
	handlerFactory.deleteOne(Admin)
)
router.put('/:id', handlerFactory.updateOne(Admin))

module.exports = router
