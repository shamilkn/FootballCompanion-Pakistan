const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')
const base64ToImage = require('base64-to-image');
const getName = require('../utils/naming')
const path = require('path')

exports.save = catchAsync(async (req, res, next) => {

    const {base64, nameType, info} = req.body;
    const path = __dirname + '/../images/';

    const options = {
        fileName: getName(),
        type: 'jpg'
    }

    if (!base64)
        return next(new AppError('Please provide base64', 400))

    let imageInfo = base64ToImage(base64, path, options); 

    res.status(200).send({ ... imageInfo, ref: req.body.ref})

});

exports.get = catchAsync(async (req, res, next) => {
    res.sendFile(path.resolve(`./images/${req.params.name}`));
})