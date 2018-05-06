const request = require('request');
const FuzzySet = require('fuzzyset.js');

const API_BASE_URL = 'https://api.tfl.gov.uk';

const LINES = {
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

const fuzzy = FuzzySet(Object.keys(LINES), false);

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

  static fuzzyLine(line) {
    const matches = fuzzy.get(line);
    if (matches && matches.length) {
      return matches[0][1];
    }
    return null;
  }

  static color(lineId) {
    return LINES[lineId] || 'FFFFFF';
  }

  get(path = '/') {
    return new Promise((resolve, reject) => {
      this.request.get(path, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Server responded with ${res.statusCode}`));
        }
        return resolve(JSON.parse(body));
      });
    });
  }
}

module.exports = TFL;
