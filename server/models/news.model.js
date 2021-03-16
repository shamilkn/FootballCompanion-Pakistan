const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsSchema = new Schema({
    highlight: {
        type: String,
        required: [true, 'Highlight is required']
    },
    body: {
        type: String,
        required: [true, 'News body is required']
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('News', newsSchema)
