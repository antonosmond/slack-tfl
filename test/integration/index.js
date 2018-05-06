const index = require('../../src/index');
const { expect } = require('chai');

describe('integration test', () => {
  describe('status', () => {
    it('should return a valid response', async() => {
      const event = {};
      event.body = {
        token: process.env.SLACK_VERIFICATION_TOKEN,
        text: 'status',
      };
      let res;
      try {
        res = await index.handler(event, null, (err, res) => {
          if (err) throw err;
          return res;
        });
      } catch(err) {
        expect(err).to.be.null;
      }
      expect(res.statusCode).to.equal(200);
      const body = JSON.parse(res.body);
      expect(body.attachments.length).to.equal(14);
    });
  });
  describe('status LINE', () => {
    const tests = [
      { title: 'Bakerloo', color: '996633' },
      { title: 'Central', color: 'CC3333' },
      { title: 'DLR', color: '009999' },
      { title: 'Hammersmith & City', color: 'CC9999' },
      { title: 'Northern', color: '000000' },
      { title: 'Waterloo & City', color: '66CCCC' },
    ];
    for (const t of tests) {
      it('should return a valid response', async() => {
        const event = {};
        event.body = {
          token: process.env.SLACK_VERIFICATION_TOKEN,
          text: `status ${t.title}`,
        };
        let res;
        try {
          res = await index.handler(event, null, (err, res) => {
            if (err) throw err;
            return res;
          });
        } catch(err) {
          expect(err).to.be.null;
        }
        expect(res.statusCode).to.equal(200);
        const body = JSON.parse(res.body);
        expect(body.attachments.length).to.equal(1);
        expect(body.attachments[0].title).to.equal(t.title);
        expect(body.attachments[0].color).to.equal(t.color);
      });

    }
  });
});
