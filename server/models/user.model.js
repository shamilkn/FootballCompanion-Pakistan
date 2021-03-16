const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First name is required'],
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is necessary'],
			unique: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		phone: {
			type: String,
			default: ''
		},
		city: {
			type: String,
			default: ''
		},
		password: {
			type: String,
			required: [true, 'A password is must and necessary'],
			minlength: 6,
			select: false,
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		emailConfirmToken: String,
		passwordResetExpires: Date,
		emailConfirmed: {
			type: Boolean,
			default: false,
		},
		status: {
			type: Number,
			default: 0
		},
	},
	{
		timestamps: true,
	}
)

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next()
	}
	this.password = await bcrypt.hash(this.password, 12)
	this.passwordChangedAt = Date.now() - 1000
	next()
})

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const pwdChanged = this.passwordChangedAt.getTime() / 1000
		const tokenIssued = JWTTimestamp
		return tokenIssued < pwdChanged
	}
	return false
}

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex')
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000
	return resetToken
}

userSchema.methods.createEmailConfirmToken = function () {
	const emailConfirmToken = crypto.randomBytes(32).toString('hex')
	this.emailConfirmToken = crypto
		.createHash('sha256')
		.update(emailConfirmToken)
		.digest('hex')
	return emailConfirmToken
}

const User = mongoose.model('User', userSchema);
module.exports = User;