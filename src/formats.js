const numeral = require('numeral');
const { omitBy } = require('lodash');

function delta(start) {
  const difference = new Date() - start;
  const string = difference < 10000 ? `${difference}ms` : `${Math.round(difference / 1000)}s`;
  return numeral(string).format('0,0');
}

function filter(data) {
  if (typeof data === 'string') {
    try {
      return omitBy(JSON.parse(data), (value, key) => {
        const regExp = /phone|password|key|mobile/gi;
        return regExp.test(String(key));
      });
    } catch (e) {
      return data;
    }
  }
  return omitBy(data, (value, key) => {
    const regExp = /phone|password|key|mobile/gi;
    return regExp.test(String(key));
  });
}

function response({ id, start, ctx, length } = {}, { short = false } = {}) {
  const log = {
    id,
    type: 'response',
    status: ctx.status || 404,
    method: ctx.method,
    path: ctx.path,
    body: filter(ctx.response.body),
    ip: ctx.ip,
    time: delta(start),
    length,
  };

  if (short) {
    return `--> ${log.method} ${log.path} ${log.status}\n${log.length} ${log.time}`;
  }

  return log;
}

function request({ id, ctx } = {}, { short = false } = {}) {
  const log = {
    id,
    type: 'request',
    method: ctx.method,
    path: ctx.path,
    query: filter(ctx.query),
    data: filter(ctx.request.body),
    ip: ctx.ip,
  };

  if (short) {
    return `<-- ${log.method} ${log.path}\n${JSON.stringify(log.query)}\n${JSON.stringify(log.data)}`.trim();
  }

  return log;
}

function error({ id, ctx, err } = {}, { short = false } = {}) {
  const log = {
    id,
    type: 'error',
    method: ctx.method,
    path: ctx.path,
    query: filter(ctx.query),
    data: filter(ctx.request.body),
    ip: ctx.ip,
    error: err,
    stack: err.stack,
  };

  if (short) {
    return `--> ${log.method} ${log.path} ${log.error.name}\n${log.stack}`.trim();
  }

  return log;
}

module.exports = {
  response,
  error,
  request,
};
