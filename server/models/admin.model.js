const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: [
				true,
				'Username is already taken. Please provide a unique username.',
			],
			minlength: 6,
			validate: [
				validator.isAlphanumeric,
				'Only letters and numbers are allowed for usernames',
			],
		},
		email: {
			type: String,
			required: [true, 'Email is necessary'],
			unique: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		password: {
			type: String,
			required: [true, 'A password is must and necessary'],
			minlength: 6,
			select: false,
		},
	},
	{
		timestamps: true,
	}
)

adminSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next()
	}
	this.password = await bcrypt.hash(this.password, 12)
	next()
})

adminSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('Admin', adminSchema)
