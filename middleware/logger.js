const pino = require('pino');
const fs = require('fs');
const { multistream } = require('pino-multi-stream');
const pretty = require('pino-pretty');

// Define a stream that writes to 'vidly.log' only for log levels above 'warn'
const fileStream = {
  stream: fs.createWriteStream('vidly.log', { flags: 'a' }),
  level: 'warn'  // Only write 'warn' level and above to the file
};

const streams = [fileStream];

if (process.env.NODE_ENV !== 'production') {
  streams.push({ stream: pretty({
    colorize: true,
    translateTime: 'SYS:standard'
  }) });
}

const logger = pino(
  { level: process.env.NODE_ENV === 'production' ? 'error' : 'debug' },
  multistream(streams)
);

module.exports = logger;
