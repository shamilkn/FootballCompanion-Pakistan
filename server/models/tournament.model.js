const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tournamentSchema = new Schema({
    
    name: {
        type: String,
        required: [true, 'Tournament Name is required'],
        default: ''
    },
    playerCount: {
        type: Number,
        default: 7,   
    },
    teams: {
        type: mongoose.ObjectId,
    },
    winningPrice: {
        type: Number,
        default: 0,
    },
    registrationFees: {
        type: Number,
        default: 0
    },
    approved: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Tournament', tournamentSchema);
