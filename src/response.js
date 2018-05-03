const debug = require('debug')('slack-tfl');

function Response(callback) {
  return {
    send: (statusCode, body) => {
      debug('Response.send()');
      debug(`statusCode: ${statusCode}`);
      let res;
      try {
        res = JSON.stringify(body);
      } catch(err) {
        throw err;
      }
      return callback(null, {
        isBase64Encoded: false,
        statusCode,
        headers: {
          'Content-type': 'application/json',
        },
        body: res,
      });
    },
  };
}

module.exports = Response;
