const express = require('express');
const bodyParser = require('body-parser');
const rootRouter = require('./routes/router');
const globalErrorHandler = require('./controllers/error.controller');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const io = require('./utils/socket.io');

const app = express();
const http = require('http').Server(app);
io.init(http);

// implement CORS

var whitelist = [];

const urls = ['http://161.97.126.249', 'http://localhost', 'http://127.0.0.1'];
const ports = [3000, 3001, 3002, 3003, 3004, 8420, 80, 443];

urls.forEach(url => {
  ports.forEach(port => {
    whitelist.push(`${url}:${port}`);
  })
  whitelist.push(url);
})

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, true)
    }
  },
  credentials : true
}

app.use(bodyParser.json({limit: '250mb'}));
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/', rootRouter)
app.all('*', (req, res, next) => {
	const err = new AppError(`Route ${req.originalUrl} does not exist`, 404)
	next(err)
})
app.use(globalErrorHandler)

module.exports = {app, http};