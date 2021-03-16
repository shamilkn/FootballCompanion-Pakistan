const User = require('../models/user.model')
const Admin = require('../models/admin.model')
const Post = require('../models/post.model')
const Order = require('../models/order.model')
const Faq = require('../models/faq.model')
const Blog = require('../models/bLog.model')

const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

let DB
if (process.env.NODE_ENV === 'development') {
	DB = process.env.DATABASE_LOCAL
} else {
	DB = process.env.DATABASE.replace(
		'<PASSWORD>',
		process.env.DATABASE_PASSWORD
	)
}

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	})
	.then(async () => {
		console.log('DATABASE CONNECTED SUCCESSFULLY')
		await deleteData()
	})
	.catch(err => {
		console.log('Error connecting to the database')
	})

async function deleteData() {
	await User.deleteMany()
	await Blog.deleteMany()
	await Admin.deleteMany()
	await Post.deleteMany()
	await Faq.deleteMany()
	await Order.deleteMany()
	console.log('Deleted all data')
	process.exit(0)
}
