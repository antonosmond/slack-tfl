const slack = require('./slack');
const Response = require('./response');

async function handler(event, context, callback) {

  // any unhandled errors should be caught, logged and then 500 returned
  try {

    const response = new Response(callback);

    const body = slack.parseBody(event.body);

    if (!slack.authenticate(body.token)) {
      return response.send(401);
    }

    const res = await slack.command(body);

    return response.send(200, res);

  } catch(err) {

    console.log(err);
    return callback(null, {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {},
      body: null,
    });

  }

}

exports.handler = handler;
