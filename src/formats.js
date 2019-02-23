const numeral = require('numeral');
const { omitBy } = require('lodash');

function delta(start) {
  const difference = new Date() - start;
  const string =
    difference < 10000
      ? `${difference}ms`
      : `${Math.round(difference / 1000)}s`;
  return numeral(string);
}

function filter(data) {
  return omitBy(data, (value, key) => {
    const regExp = /phone|password|key|mobile/gi;
    return regExp.test(String(key));
  });
}

function response(id, start, ctx, length) {
  return {
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
}

function request(id, ctx) {
  return {
    id,
    type: 'request',
    method: ctx.method,
    path: ctx.path,
    query: filter(ctx.query),
    data: filter(ctx.request.body),
    ip: ctx.ip,
  };
}

function error(id, ctx, err) {
  return {
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
}

module.exports = {
  response,
  error,
  request,
};
