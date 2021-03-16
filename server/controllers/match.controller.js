const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Match = require('../models/match.model');
const factory = require('./handlerFactory');
const { getIo } = require('../utils/socket.io');

exports.getAll = factory.getAll(Match);

exports.addSummary = catchAsync(async (req, res, next) => {

    const id = req.params.id;
    const io = getIo();

    const {
        action,
        player,
        team,
        isLive,
    } = req.body;

    if (typeof isLive !== "undefined") {
        await Match.updateOne({
            _id: id
        }, {isLive});
        io.sockets.emit('updateLive', {
            matchId: id,
            status: isLive,
        });
    }

    if (action) {
        await Match.updateOne({
            _id: id
        }, {$push: { summary: {
                player,
                team,
                action
            }}
        });

        if (action === 'goal') {

            let goalCount = 0;

            io.sockets.emit('goal', {
                matchId: id,
                player,
                team,
                goals: goalCount,
            });

        }
        else {
            io.sockets.emit('matchUpdate', {
                matchId: id,
                action,
                team,
                player
            })
        }

    }

    res.send({
        status: 'success',
        data: {}
    })

});
