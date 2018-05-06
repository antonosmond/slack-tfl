const qs = require('qs');
const TFL = require('./tfl');


const MODES = ['tube', 'dlr', 'overground', 'tflrail'];

const tfl = new TFL();

const usage = `
  *USAGE*:
    */tfl status*       show a status overview of all lines
    */tfl status LINE   get the status of the given line e.g. DLR
`;

function authenticate(t) {
  return t === process.env.SLACK_VERIFICATION_TOKEN;
}

function parseBody(body) {
  return qs.parse(body);
}

function command(text) {
  return new Promise(resolve => {
    const args = [];
    text.split(' ').forEach(a => a.trim().length && args.push(a));
    const subcommand = args.shift();
    const line = args.shift();
    let matchedLine;
    if (line) {
      matchedLine = TFL.fuzzyLine(line);
      if (!matchedLine) {
        return resolve({ text: `Unrecognized line: ${line}` });
      }
    }
    switch (subcommand) {
    case 'status': {
      return resolve(getStatus(matchedLine));
    }
    default:
      return resolve({ text: usage });
    }
  });
}

async function getStatus(selectedLine) {
  let data;
  try {
    if (selectedLine) {
      data = await tfl.get(`Line/${selectedLine}/Status`);
    } else {
      data = await tfl.get(`Line/Mode/${MODES.join(',')}/Status`);
    }
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
  attachment.color = TFL.color(line.id);
  attachment.title = line.name;
  attachment.fields = [];
  for (const s of line.lineStatuses) {
    let emoji = '';
    if (s.statusSeverity !== 10) {
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
