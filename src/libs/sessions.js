const Session = require('../models/Session');

async function addSessionDB(resendBotId, login, isAdmin) {
    isAdmin = isAdmin ? true : false;
    const session = new Session({
        resendBotId,
        login,
        isAdmin
    });

    await session.save();
}

async function findSessionId(resendBotId) {
    const session = await Session.findOne({ resendBotId });
    if (!session) return null;
    return session;
}

async function findSessionLogin(login) {
    const session = await Session.findOne({ login });
    if (!session) return null;
    return session;
}

async function updateSignOut(resendBotId) {
    const info = await Session.updateOne({ resendBotId }, { logged: false });
    if (!info) throw new Error('Some error with sign out!');
    return info;
}

async function updateSignIn(login) {
    const info = await Session.updateOne({ login }, { logged: true });
    if (!info) throw new Error('Some error with sign in!');
    return info;
}

async function deleteSessionDB(login) {
    await Session.deleteOne({ login }, err => {
        if (err) throw new Error('Some problem with deleting session.');
    });
}

module.exports = {
    addSessionDB,
    findSessionId,
    findSessionLogin,
    updateSignIn,
    updateSignOut,
    deleteSessionDB
};