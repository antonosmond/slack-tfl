const request = require('request');
const debug = require('debug')('slack-tfl');

const API_BASE_URL = 'https://api.tfl.gov.uk';

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

class TFL {

  constructor(
    appId = process.env.TFL_APP_ID,
    appKey = process.env.TFL_APP_KEY,
    apiBaseUrl = API_BASE_URL,
  ) {
    if (!(appId && appKey)) {
      throw new Error('Missing TfL API Credentials');
    }
    this.request = request.defaults({
      baseUrl: apiBaseUrl,
      qs: {
        detail: false,
        app_id: appId, // eslint-disable-line
        app_key: appKey, // eslint-disable-line
      },
    });
  }

  static color(lineId) {
    return COLORS[lineId] || 'FFFFFF';
  }

  get(url) {
    debug(`TFL.get(${url})`);
    return new Promise((resolve, reject) => {
      this.request.get(url, (err, res, body) => {
        if (err) return reject(err);
        if (res.statusCode != 200) {
          return reject(new Error(`Server responded with ${res.statusCode}`));
        }
        return resolve(body);
      });
    });
  }
}

module.exports = TFL;
