const slack = require('./slack');
const Response = require('./response');
const debug = require('debug')('slack-tfl');

async function handler(event, context, callback) {

  // any unhandled errors should be caught, logged and then 500 returned
  try {

    const response = new Response(callback);

    const body = slack.parseBody(event.body);

    if (!slack.authenticate(body.token)) {
      debug('Auth failure');
      return response.send(401);
    }

    const res = await slack.command(body.text);

    return response.send(200, res);

  } catch(err) {

    console.log(err); // eslint-disable-line

    return callback(null, {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {},
      body: {},
    });

  }

}

exports.handler = handler;
