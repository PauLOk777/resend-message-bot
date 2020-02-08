const Session = require('../models/Session');

async function addSession(pubChatId, email) {
    const session = new Session({
        pubChatId,
        email,
    });

    await session.save();
}

async function findSession(pubChatId) {
    const session = await Session.findOne({ pubChatId });
    if (!session) return null;
    return session;
}

async function findSessionEmail(email) {
    const session = await Session.findOne({ email });
    if (!session) return null;
    return session;
}

async function updateLog(pubChatId) {
    const info = await Session.updateOne({ pubChatId }, { log: false });
    if (!info) throw new Error('Some error with sign out!');
    return info;
}

async function updateSignIn(email, key) {
    const info = await Session.updateOne({ email }, { log: true });
    if (!info) throw new Error('Some error with sign in!');
    return info;
}

module.exports = {
    addSession,
    findSession,
    findSessionEmail,
    updateSignIn,
    updateLog,
};