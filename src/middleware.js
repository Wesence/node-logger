const uuid = require('uuid');
const formats = require('./formats');

function configureMiddleware(logger, { short = false } = {}) {
  return async (ctx, next) => {
    const start = new Date();
    const id = uuid();

    logger.info(formats.request({ id, ctx }, { short }));

    try {
      await next();
    } catch (err) {
      logger.error(formats.error({ id, ctx, err }, { short }));
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

      logger.info(formats.response({ id, start, ctx, length: counter ? counter.length : length }, { short }));
    }

    ctx.res.once('finish', done);
    ctx.res.once('close', done);
  };
}

module.exports = configureMiddleware;
