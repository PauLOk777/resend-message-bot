const argon2 = require('argon2');

const User = require('../models/User');

async function addUser(login, password) {
    const hash = await argon2.hash(password);

    const user = new User({
        login,
        password: hash,
        isAdmin: false
    });

    await user.save();
}

async function checkUser(login, password) {
    const user = await User.findOne({ login });
    if (!user) return false;
    return argon2.verify(user.password, password);
}

async function findUser(login) {
    const user = await User.findOne({ login });
    if (!user) return null;
    return user;
}

async function deleteUser(login) {
    await User.deleteOne({ login }, err => {
        if (err) throw new Error('Some problem with deleting user.');
    });
}

module.exports = {
    addUser,
    checkUser,
    findUser,
    deleteUser
};