const slack = require('./slack');

async function handler(event, context, callback) {

  // any unhandled errors should be caught, logged and then 500 returned
  try {

    const body = slack.parseBody(event.body);

    if (!slack.authenticate(body.token)) {
      console.log('Auth failure'); // eslint-disable-line
      return callback(null, {
        statusCode: 401,
      });
    }

    const res = await slack.command(body.text);

    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(res),
    });

  } catch(err) {

    console.log(err); // eslint-disable-line

    return callback(null, {
      statusCode: 500,
    });

  }

}

exports.handler = handler;
