const server = require('./init/server.js');
const db = require('./init/db.js');
const bot = require('./init/bot');

async function main() {
    await server.init();
    await db.init();

    await bot.init();
}

main();
