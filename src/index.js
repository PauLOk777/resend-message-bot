const server = require('./init/server.js');
const db = require('./init/db.js');

async function main() {
    await server.init();
    await db.init();
}

main();