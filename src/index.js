const server = require('./init/server.js');
const db = require('./init/db.js');
const bot = require('./init/bot');
// const { addUserDB } = require('./libs/users.js');
// const { addSessionDB } = require('./libs/sessions.js');
// const generateKey = require('./libs/random.js');

async function main() {
    await server.init();
    await db.init();

    await bot.init();

    // const key = generateKey(50);
    // await addSessionDB(key, 'paulok');
    // await addUserDB('paulok', '777');
}

main();
