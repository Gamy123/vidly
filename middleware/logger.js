// logger.js
const pino = require('pino');
const fs = require('fs');
const { multistream } = require('pino-multi-stream');
const pretty = require('pino-pretty');

const streams = [
  { stream: fs.createWriteStream('vidly.log', { flags: 'a' }) },
];

if (process.env.NODE_ENV !== 'production') {
  streams.push({ stream: pretty({
    colorize: true,
    translateTime: 'SYS:standard'
  }) });
}

const logger = pino(
  { level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' },
  multistream(streams)
);

module.exports = logger;
