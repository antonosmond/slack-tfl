const { expect } = require('chai');
const nock = require('nock');

const TFL = require('../src/tfl');

describe('class TFL', () => {

  describe('constructor', () => {

    let _appId, _appKey;

    beforeEach(() => {
      // ensure the environment doesn't affect these tests
      _appId = process.env.TFL_APP_ID && delete process.env.TFL_APP_ID;
      _appKey = process.env.TFL_APP_KEY && delete process.env.TFL_APP_KEY;
    });

    afterEach(() => {
      // restore the environment so we don't affect other tests
      process.env.TFL_APP_ID = _appId;
      process.env.TFL_APP_KEY = _appKey;
    });

    describe('validation', () => {

      const testCases = [
        undefined,
        null,
        '',
      ];

      it('should throw if appId is falsey', () => {
        for (const t of testCases) {
          expect(() => { new TFL(t, 'appKey'); }).to.throw();
        }
      });

      it('should throw if appKey is falsey', () => {
        for (const t of testCases) {
          expect(() => { new TFL('appId', t); }).to.throw();
        }
      });

    });

  });

  describe('color', () => {

    const testCases = [
      { id: 'bakerloo', expected: '996633' },
      { id: 'central', expected: 'CC3333' },
      { id: 'circle', expected: 'FFCC00' },
      { id: 'district', expected: '006633' },
      { id: 'dlr', expected: '009999' },
      { id: 'hammersmith-city', expected: 'CC9999' },
      { id: 'jubilee', expected: '868F98' },
      { id: 'london-overground', expected: 'E86A10' },
      { id: 'metropolitan', expected: '660066' },
      { id: 'northern', expected: '000000' },
      { id: 'piccadilly', expected: '0019A8' },
      { id: 'tfl-rail', expected: '0019A8' },
      { id: 'victoria', expected: '0099CC' },
      { id: 'waterloo-city', expected: '66CCCC' },
    ];

    it('should return the HEX color for a given line ID', () => {
      for (const t of testCases) {
        expect(TFL.color(t.id)).to.equal(t.expected);
      }
    });

    it('should default to white (FFFFFF) if id not found', () => {
      const defaultTestCases = [
        null,
        undefined,
        'unknown',
      ];
      for (const t of defaultTestCases) {
        expect(TFL.color(t)).to.equal('FFFFFF');
      }
    });

  });

  describe('status', () => {

    beforeEach(() => {
      nock.cleanAll();
    });

    const appId = 'appId';
    const appKey = 'appKey';

    const tfl = new TFL(appId, appKey);

    it('should append the request path to the base API path', async () => {

      const scope = nock('https://api.tfl.gov.uk')
        .get(/\/some\/api\/path.*/)
        .reply(200, uri => { return JSON.stringify(uri); });

      const uri = await tfl.get('/some/api/path');

      expect(scope.isDone()).to.be.true;
      expect(uri.includes('/some/api/path'));

    });

    it('should append the relevant query params to the request', async () => {

      const scope = nock('https://api.tfl.gov.uk')
        .get(/.*/)
        .query({
          detail: false,
          app_id: 'appId', //eslint-disable-line
          app_key: 'appKey', //eslint-disable-line
        })
        .reply(200, uri => { return JSON.stringify(uri); });

      const uri = await tfl.get('/some/api/path');

      expect(scope.isDone()).to.be.true;
      expect(uri.includes('detail=false')).to.be.true;
      expect(uri.includes('app_id=appId')).to.be.true;
      expect(uri.includes('app_key=appKey')).to.be.true;

    });

    it('should make the request and return the response', async () => {

      const scope = nock('https://api.tfl.gov.uk')
        .get(/.*/)
        .reply(200, JSON.stringify('OK'));

      let res;
      try {
        res = await tfl.get('/some/api/path');
      } catch(err) {
        throw err;
      }

      expect(scope.isDone()).to.be.true;
      expect(res).to.equal('OK');

    });

  });

});
