const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();

const _server = require('./app');

const port = process.env.PORT || 5001

const server = _server.http.listen(port, () => {
	console.log(`Running on port ${port}`)
})

process.on('unhandledRejection', err => {
	console.log('UNHANDLED REJECTION')
	console.log(err)
	server.close(() => {
		process.exit(1)
	})
})

process.on('uncaughtException', err => {
	console.log('UNCAUGHT EXCEPTION')
	console.log(err)
	server.close(() => {
		process.exit(1)
	})
})

let DB
if (process.env.NODE_ENV === 'development') {
	DB = process.env.DATABASE_LOCAL
} else {
	//DB = process.env.DATABASE.replace(
	//	'<PASSWORD>',
	//	process.env.DATABASE_PASSWORD
	//)
	DB = 'mongodb+srv://football:12341234@cluster0.w3pxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
}

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(db => {
		console.log('successfull database connection')
	})
	.catch(err => {
		console.log('Database Connection erorr', err)
	})