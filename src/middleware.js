const uuid = require('uuid');
const formats = require('./formats');

function configureMiddleware(Logger) {
  return async (ctx, next) => {
    const start = new Date();
    const id = uuid();

    Logger.info(formats.request(id, ctx));

    try {
      await next();
    } catch (err) {
      Logger.error(formats.error(id, ctx, err));
      throw err;
    }

    const { length } = ctx.response;
    const { body } = ctx;
    let counter;
    if (length === null && body && body.readable) {
      ctx.body = body.on('error', ctx.onerror);
    }

    function done() {
      ctx.res.removeListener('finish', done);
      ctx.res.removeListener('close', done);

      Logger.info(
        formats.response(id, start, ctx, counter ? counter.length : length),
      );
    }

    ctx.res.once('finish', done);
    ctx.res.once('close', done);
  };
}

module.exports = configureMiddleware;
