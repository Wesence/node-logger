const { createLogger, format, transports } = require('winston');
const moment = require('moment');

const { combine, label: formatLabel, printf, colorize } = format;

const customFormat = printf((msg) => {
  const timestasmp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');
  return `[${msg.label}] [${timestasmp}] [${msg.level.toUpperCase()}]: ${
    msg.message
  }`;
});

let Logger;

function configure({ label }) {
  const options = {
    level: 'silly',
    handleExceptions: true,
    json: false,
    format: combine(
      formatLabel({ label }),
      colorize({
        message: true,
      }),
      customFormat,
    ),
    transports: [],
  };

  options.transports.push(new transports.Console());

  options.json = false;
  Logger = createLogger(options);
  return {
    Logger,
  };
}

module.exports = configure({ label: 'TEST' });
