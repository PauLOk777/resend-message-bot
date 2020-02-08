const server = require('./init/server.js');
const db = require('./init/db.js');
// const { addUserDB } = require('./libs/users.js');
// const { addSessionDB } = require('./libs/sessions.js');
// const generateKey = require('./libs/random.js');

async function main() {
    await server.init();
    await db.init();

    // const key = generateKey(50);
    // await addSessionDB(key, 'paulok');
    // await addUserDB('paulok', '777');
}

main();