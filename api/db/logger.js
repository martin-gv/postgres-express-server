const chalk = require('chalk');

const { blue, green, yellow, magenta } = chalk;
const { log } = console;

function logEvent(client, colour, text) {
  log(`Client ${client.processID} ${colour(text)}`);
}

function setupEventLoggers(pool) {
  log(blue('Creating new pool'));

  pool.on('connect', (client) => logEvent(client, green, 'connected'));
  pool.on('acquire', (client) => logEvent(client, yellow, 'aquired'));
  pool.on('remove', (client) => logEvent(client, magenta, 'closed & removed'));
}

function logCurrentConnections({ totalCount, idleCount, waitingCount }) {
  log(
    blue(`Total: ${totalCount}, Idle: ${idleCount}, Waiting: ${waitingCount}`),
  );
}

module.exports = { setupEventLoggers, logCurrentConnections };
