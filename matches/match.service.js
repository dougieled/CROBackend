const db = require('_helpers/db');
module.exports = {
    getAll,
    getMyMatches,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Match.findAll();
}
async function getMyMatches(req) {
    return await db.Match.findAll({
        where: {
          userId: parseInt(req.user.id)
        }
      })
}

async function getById(id) {
    return await getMatch(id);
}

async function create(req,params) {
    // save match
    params.userId = req.user.id;
    await db.Match.create(params);
}

async function update(req, id, params) {
    const match = await getMatch(id);
    if (match.id !== parseInt(id)) {
        throw 'Unable to update match as the ID is different to original ID'
    }
    if (parseInt(match.userId) !== req.user.id) {
        throw 'A User can only update their own Matches'
    }

    // copy params to match and save
    Object.assign(match, params);
    await match.save();

    return match.get();
}

async function _delete(id) {
    const match = await getMatch(id);
    await match.destroy();
}

// helper functions

async function getMatch(id) {
    const match = await db.Match.findByPk(id);
    if (!match) throw 'Match not found';
    return match;
}

