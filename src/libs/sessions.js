const Session = require('../models/Session');

async function addSession(resendBotID, login) {
    const session = new Session({
        resendBotID,
        login,
    });

    await session.save();
}

async function findSessionId(resendBotID) {
    const session = await Session.findOne({ resendBotID });
    if (!session) return null;
    return session;
}

async function findSessionLogin(login) {
    const session = await Session.findOne({ login });
    if (!session) return null;
    return session;
}

async function updateSignOut(resendBotID) {
    const info = await Session.updateOne({ resendBotID }, { loggged: false });
    if (!info) throw new Error('Some error with sign out!');
    return info;
}

async function updateSignIn(login) {
    const info = await Session.updateOne({ login }, { logged: true });
    if (!info) throw new Error('Some error with sign in!');
    return info;
}

async function deleteSession(login) {
    await Session.deleteOne({ login }, err => {
        if (err) throw new Error('Some problem with deleting session.');
    });
}

module.exports = {
    addSession,
    findSessionId,
    findSessionLogin,
    updateSignIn,
    updateSignOut,
    deleteSession
};