const argon2 = require('argon2');

const User = require('../models/User');

async function addUserDB(login, password) {
    const hash = await argon2.hash(password);

    const user = new User({
        login,
        password: hash,
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

async function deleteUserDB(login) {
    await User.deleteOne({ login }, err => {
        if (err) throw new Error('Some problem with deleting user.');
    });
}

async function findAllUsersDB() {
    const users = await User.find({}, err => {
        if (err) throw new new Error('Problem with find all users');
    });

    return users;
}

module.exports = {
    addUserDB,
    checkUser,
    findUser,
    deleteUserDB,
    findAllUsersDB
};