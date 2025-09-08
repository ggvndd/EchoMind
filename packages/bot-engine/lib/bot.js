// Core bot logic: Rule-based with regex and pronoun reflection
const fs = require('fs');

function logToFile(message) {
  const logEntry = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync('logs/bot.log', logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

const reflections = {
  'i': 'you',
  'me': 'you',
  'my': 'your',
  'mine': 'yours',
  'am': 'are',
  'was': 'were',
  'i\'m': 'you\'re',
  'i\'ve': 'you\'ve',
  'i\'ll': 'you\'ll',
  'myself': 'yourself',
};

function reflect(text) {
  logToFile(`Reflecting input: ${text}`);
  const words = text.toLowerCase().split(' ');
  const reflected = words.map(word => reflections[word] || word).join(' ');
  logToFile(`Reflected output: ${reflected}`);
  return reflected;
}

const rules = [
  {
    pattern: /hello|hi|hey/i,
    responses: ['Hello! How can I help you today?', 'Hi there! What\'s on your mind?']
  },
  {
    pattern: /I am (.+)/i,
    responses: (match) => [`Why are you ${match[1]}?`, `Tell me more about being ${match[1]}.`]
  },
  {
    pattern: /I feel (.+)/i,
    responses: (match) => [`Why do you feel ${reflect(match[1])}?`, `What makes you feel ${reflect(match[1])}?`]
  },
  {
    pattern: /My (.+) is (.+)/i,
    responses: (match) => [`Tell me more about your ${match[1]}.`, `Why is your ${match[1]} ${reflect(match[2])}?`]
  },
  {
    pattern: /I think (.+)/i,
    responses: (match) => [`Do you really think ${reflect(match[1])}?`, `Why do you think ${reflect(match[1])}?`]
  },
  {
    pattern: /Yes|No/i,
    responses: ['Interesting. Why?', 'Can you elaborate?']
  },
  {
    pattern: /Because (.+)/i,
    responses: (match) => [`Is that the real reason for ${reflect(match[1])}?`, `What other reasons might there be?`]
  },
  {
    pattern: /bye|goodbye/i,
    responses: ['Goodbye! Take care.', 'See you later!']
  }
];

function getResponse(message) {
  logToFile(`Processing message: ${message}`);
  for (const rule of rules) {
    const match = message.match(rule.pattern);
    if (match) {
      let responses = rule.responses;
      if (typeof responses === 'function') {
        responses = responses(match);
      }
      logToFile(`Matched rule: ${rule.pattern}, Response: ${responses}`);
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  logToFile(`No match found for: ${message}, using fallback`);
  return 'Tell me more about that.';
}

module.exports = { getResponse, reflect };