const qs = require('qs');
const TFL = require('./tfl');

const token = process.env.SLACK_VERIFICATION_TOKEN;

const MODES = ['tube', 'dlr', 'overground', 'tflrail'];

const TFL_CONFIG = {
  appId: process.env.TFL_APP_ID,
  appKey: process.env.TFL_APP_KEY,
};

const tfl = new TFL(TFL_CONFIG);

const usage = `
  *USAGE*:
    */tfl status*    show a status overview of all lines
`;

function authenticate(t) {
  return t == token;
}

function parseBody(body) {
  return qs.parse(body);
}

function command(body) {
  return new Promise(resolve => {
    const args = [];
    body.text.split(' ').forEach(a => a.trim().length && args.push(a));
    const subcommand = args.shift();
    switch (subcommand) {
    case 'status': {
      return resolve(getStatus());
    }
    default:
      return resolve({ text: usage });
    }
  });
}

async function getStatus() {
  let data;
  try {
    data = await tfl.Get(`Line/Mode/${MODES.join(',')}/Status`);
  } catch(err) {
    throw err;
  }
  const response = {
    response_type: 'in_channel', // eslint-disable-line
    attachments: [],
  };
  for (const line of data) {
    response.attachments.push(buildAttachment(line));
  }
  return response;
}

function buildAttachment(line) {
  const attachment = {};
  attachment.color = tfl.COLORS[line.id];
  attachment.title = line.name;
  attachment.fields = [];
  for (const s of line.lineStatuses) {
    let emoji = '';
    if (s.statusSeverity != 10) {
      emoji = ':warning: ';
    }
    const f = {
      value: `${emoji}${s.statusSeverityDescription}`,
      short: false,
    };
    if (s.reason) {
      f.value += `\n${s.reason}`;
    }
    attachment.fields.push(f);
  }
  return attachment;
}

module.exports = {
  authenticate,
  parseBody,
  command,
};
