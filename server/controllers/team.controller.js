const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Team = require('../models/team.model');
const Match = require('../models/match.model');
const factory = require('./handlerFactory');
const _ = require('lodash');

exports.getAll = factory.getAll(Team);
exports.getOne = factory.getOne(Team);

exports.createTeam = catchAsync(async (req, res, next) => {
    req.body.owner = req.user.id;
    let team = new Team(req.body);
    await team.save();
    res.send({
        status: 'success',
        data: team
    })
});

exports.requestAsMember = catchAsync(async (req, res, next) => {

    if (!req.body.teamId) {
        return next(
			new AppError(
				'Team is required',
				400
			)
		)
    }

    let team = await Team.findById(req.body.teamId);
    if (team) {
        if (team.membersRequest.indexOf(req.user.id) > -1) {
            return res.send({
                status: 'error',
                message: 'A request is already sent'
            }, 400)
        }
        if (team.members.indexOf(req.user.id) > -1) {
            return res.send({
                status: 'error',
                message: 'You are already member of this team'
            }, 400)
        }
    }

    await Team.update(
        {_id: req.body.teamId},
        {$push: {membersRequest: req.user.id}}
    );

    res.send({
        status: 'success',
        data: {}
    })

});

const moveRequests = async (id, userId, from, to) => {
    return await Team.updateOne(
        {_id: id},
        {
            $pull: {[from]: userId},
            $push: {[to]: userId}
        }
    );
}

const moveMatchRequest = async (id, request, from, to) => {
    return await Team.updateOne(
        {_id: id},
        {
            $pull: {[from]: {
                _id: request._id
            }},
            $push: {[to]: request}
        }
    );
}

exports.acceptMemberRequest = catchAsync(async (req, res, next) => {
    const {
        teamId, userId
    } = req.body;

    const owner = req.user.id;

    let team = await Team.findById(teamId);

    if (!teamId || !userId) {
        return next (
            new AppError(
                'Team Id and User Id are required',
                400
            )
        );
    }

    if (!team) {
        return next(
            new AppError(
                'Team not found',
                404
            )
        )
    }
    else if (owner !== team.owner) {
        return next(
            new AppError(
                'Only team owner can accept requests',
                401
            )
        )
    }

    if (team.membersRequest.indexOf(userId) === -1) {
        return next(
            new AppError(
                'No such request found',
                404
            )
        )
    }

    moveRequests(teamId, userId, 'membersRequest', 'members');

    res.send({
        status: 'success',
        data: {},
    });

});

exports.rejectMemberRequest = catchAsync(async (req, res, next) => {
    const {
        teamId, userId
    } = req.body;

    const owner = req.user.id;

    let team = await Team.findById(teamId);

    if (!teamId || !userId) {
        return next (
            new AppError(
                'Team Id and User Id are required',
                400
            )
        );
    }

    if (!team) {
        return next(
            new AppError(
                'Team not found',
                404
            )
        )
    }
    else if (owner !== team.owner) {
        return next(
            new AppError(
                'Only team owner can accept requests',
                401
            )
        )
    }

    if (team.membersRequest.indexOf(userId) === -1) {
        return next(
            new AppError(
                'No such request found',
                404
            )
        )
    }

    await moveRequests(teamId, userId, 'membersRequest', 'cancelledMembersRequest');

    res.send({
        status: 'success',
        data: {},
    });

});

exports.matchRequest = catchAsync(async (req, res, next) => {

    if (!req.body.teamId) {
        return next(
			new AppError(
				'Team is required',
				400
			)
		)
    }
    
    await Team.update(
        {_id: req.body.teamId},
        {$push: {matchesRequest: {
            from: req.body.team2,
            message: req.body.message,
            location: req.body.location,
            date: req.body.date
        }}}
    );

    res.send({
        status: 'success',
        data: {}
    })

});

exports.acceptMatchRequest = catchAsync(async (req, res, next) => {

    const {
        requestId,
        teamId,
    } = req.body;

    if (!teamId || !requestId) {
        return next (new AppError(
            'TeamId and Request Id is required',
            400
        ));
    }

    const team = await Team.findById(teamId);

    if (team.owner === req.user) {
        return next(
            new AppError(
                'Only Team Admins can accept the request',
                401
            )
        )
    }

    const filteredRequest = team.matchesRequest.filter(req => {
        return req._id.equals(requestId);
    })

    const request = filteredRequest.length > 0 ? filteredRequest[0]: null;

    if (!request) {
        return next(
            new AppError(
                'Request not found',
                400
            )
        );
    }

    moveMatchRequest(
        teamId,
        request,
        "matchesRequest",
        "acceptedMatchesRequest"
    );

    let match = new Match({
        team1: request.from,
        team2: teamId,
        host: request.from,
        venue: request.location,
        time: request.date,
    });

    await match.save();

    res.send({data: match});

});

exports.rejectMatchRequest = catchAsync(async (req, res, next) => {
    return res.send("HELLO WORLD")
})