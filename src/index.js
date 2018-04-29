const TFL = require('./tfl');
const Botkit = require('botkit');

const MODES = ['tube', 'dlr', 'overground', 'tflrail'];

const SLACK_CONFIG = {
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  clientVerificationToken: process.env.SLACK_CLIENT_VERIFICATION_TOKEN,
  scopes: ['commands'],
};

const TFL_CONFIG = {
  appId: process.env.TFL_APP_ID,
  appKey: process.env.TFL_APP_KEY,
};

const usage = `
  tfl usage:
    \`/tfl help\`    show usage
    \`/tfl status\`  show a status overview of all lines
`;

const tfl = new TFL(TFL_CONFIG);
const slack = Botkit.slackbot(SLACK_CONFIG);

slack.on('slash_command', (bot, message) => {

  if (message.token !== process.env.VERIFICATION_TOKEN) return;

  switch (message.command) {
  case '/tfl': {
    if (!message.text) {
      message.text = 'help';
    }
    const args = [];
    message.text.split(' ').forEach(a => a.trim().length && args.push(a));
    const subcommand = args.shift();
    switch (subcommand) {
    case 'status':
      return bot.replyPublic(message, getStatus());
    default:
      return bot.replyPrivate(message, usage);
    }
  }
  default:
    return bot.replyPrivate(message, `${message.command} is not a valid command`);
  }
});

async function getStatus() {
  let data;
  try {
    data = await tfl.Get(`Line/Mode/${MODES.join(',')}/Status`);

  } catch(err) {
    throw err;
  }
  const response = { attachments: [] };
  for (const line of data) {
    response.attachments.push(buildAttachment(line));
  }
  return response;
}

function buildAttachment(line) {
  const attachment = {};
  attachment.color = tfl.colors[line.id];
  attachment.title = line.name;
  attachment.fields = [];
  for (const s of line.lineStatuses) {
    let emoji = '';
    if (s.severityLevel != 10) {
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

exports.handler = function(event, context) {
  // const body = event.body;
  // const params = qs.parse(body);
  // const validationToken = params.token;
  return context.succeed();
};
