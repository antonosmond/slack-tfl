const request = require('request');

const API_URL = 'https://api.tfl.gov.uk';

const COLORS = {
  'bakerloo': '996633',
  'central': 'CC3333',
  'circle': 'FFCC00',
  'district': '006633',
  'dlr': '009999',
  'hammersmith-city': 'CC9999',
  'jubilee': '868F98',
  'london-overground': 'E86A10',
  'metropolitan': '660066',
  'northern': '000000',
  'piccadilly': '0019A8',
  'tfl-rail': '0019A8',
  'victoria': '0099CC',
  'waterloo-city': '66CCCC',
};

function TFL(config) {

  if (!config.appId || !config.appKey) {
    throw new Error('ERROR: TfL API credentials missing or invalid');
  }

  this.COLORS = COLORS;

  const defaults = {
    baseUrl: API_URL,
    qs: {
      app_id: config.appId, // eslint-disable-line
      app_key: config.appKey, // eslint-disable-line
    },
  };

  this.Get = function(url) {
    return new Promise((resolve, reject) => {
      request
        .defaults(defaults)
        .get(url, (err, res, body) => {
          if (err) {
            return reject(err);
          }
          if (res.statusCode != 200) {
            return reject(new Error(`TfL API responded with: ${res.statusCode} - ${res.statusMessage}`));
          }
          let data;
          try {
            data = JSON.parse(body);
          } catch(err) {
            return reject(err);
          }
          return resolve(data);
        });
    });
  };

}

module.exports = TFL;
