const mongoose = require('mongoose')
const Schema = mongoose.Schema

const matchSchema = new Schema({
    team1: {
        type: Schema.ObjectId,
        required: [true, '2 teams are required for match']
    },
    team2: {
        type: Schema.ObjectId,
        required: [true, '2 teams are required for match']
    },
    host: {
        type: Schema.ObjectId,
        required: [true, 'Host is required']
    },
    venue: {
        type: String,
        required: [true, 'Venue is required']
    },
    time: {
        type: Number,
        default: 0,
        required: [true, 'Time of match is required']
    },
    isLive: {
        type: Boolean,
        default: false,
    },
    result: {
        type: Number,
        default: -1
    },
    winner: {
        type: Schema.ObjectId,
    },
    summary: {
        type: [{
            action: {
                type: String,
                required: [true, 'action is required'],
            },
            player: {
                type: Schema.ObjectId,
                default: null
            },
            team: {
                type: Schema.ObjectId,
                default: null
            },
            time: {
                type: Number,
                default: Date.now()
            }
        }],
        default: []
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Match', matchSchema);