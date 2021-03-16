const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    members: {
        type: [String],
        default: []
    },
    owner: {
        type: String,
        required: [true, 'A team must have team owner']
    },
    name: {
        type: String,
        required: [true, 'Team name is required']
    },
    tname: {
        type: String,
        unique: [true, 'Team Unique name should be unique'],
        required: [true, 'Team unique name is required']
    },
    membersRequest: {
        type: [String],
        default: []
    },
    cancelledMembersRequest: {
        type: [String],
        default: []
    },
    matchesRequest: {
        type: [{
            _id: {
                type: mongoose.Types.ObjectId,
                default: () => {
                    return new ObjectID();
                }
            },
            from: {
                type: String,
                required: [true, 'A team is required to send match request']
            },
            message: {
                type: String,
                default: ''
            },
            location: {
                type: String,
                default: '',
            },
            date: {
                type: Number,
                default: -1,
            }
        }],
        default: []
    },
    acceptedMatchesRequest: {
        type: [{
            _id: {
                type: mongoose.Types.ObjectId,
                default: () => {
                    return new ObjectID();
                }
            },
            from: {
                type: String,
                required: [true, 'A team is required to send match request']
            },
            message: {
                type: String,
                default: ''
            },
            location: {
                type: String,
                default: '',
            },
            date: {
                type: Number,
                default: -1,
            }
        }],
        default: []
    },
    rejectedMatchesRequest: {
        matchesRequest: {
        type: [{
            _id: {
                type: mongoose.Types.ObjectId,
                default: () => {
                    return new ObjectID();
                }
            },
            from: {
                type: String,
                required: [true, 'A team is required to send match request']
            },
            message: {
                type: String,
                default: ''
            },
            location: {
                type: String,
                default: '',
            },
            date: {
                type: Number,
                default: -1,
            }
        }],
        default: []
    },
    rejectedMatchesRequest: {
        type: [{
            _id: {
                type: mongoose.Types.ObjectId,
                default: () => {
                    return new ObjectID();
                }
            },
            from: {
                type: String,
                required: [true, 'A team is required to send match request']
            },
            message: {
                type: String,
                default: ''
            },
            location: {
                type: String,
                default: '',
            },
            date: {
                type: Number,
                default: -1,
            }
        }],
        default: []
    }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);