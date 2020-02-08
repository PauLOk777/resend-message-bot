const server = require('./init/server');

async function main() {
    await server.init();
}

main();