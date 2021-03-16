const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './submissions');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

exports.singleMiddleware = multer({ storage: storage });