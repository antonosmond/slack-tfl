function Response(callback) {
  const res = {};
  res.send = (statusCode, body) => {
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
  };
  return res;
}

module.exports = Response;
