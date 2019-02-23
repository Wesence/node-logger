const { createLogger, format, transports } = require('winston');

const { combine, label: formatLabel, printf, colorize, errors } = format;

const customFormat = printf((msg) => {
  const timestamp = new Date().toISOString();
  let result = `[${timestamp}] [${msg.level}]: ${msg.message}`;

  if (msg.label) {
    result = `[${msg.label}] ${result}`;
  }

  if (msg.stack) {
    result = `${result}\n${msg.stack}`;
  }

  return result;
});

let Logger;

function configure({ label }) {
  const options = {
    level: 'silly',
    handleExceptions: true,
    json: false,
    format: combine(
      formatLabel({ label }),
      colorize({ all: true }),
      errors({ stack: true }),
      customFormat,
    ),
    transports: [new transports.Console()],
  };

  global.Logger = createLogger(options);
  Object.freeze(global.Logger);

  return global.Logger;
}

module.exports = configure;
