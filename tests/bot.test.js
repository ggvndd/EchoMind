const { getResponse, reflect } = require('../packages/bot-engine/lib/bot.js'); // Adjust path if needed

describe('Pronoun Reflection', () => {
  test('Reflects I to you', () => {
    expect(reflect('I am happy')).toBe('you are happy');
  });

  test('Reflects my to your', () => {
    expect(reflect('My dog is mine')).toBe('your dog is yours');
  });

  test('No change if no match', () => {
    expect(reflect('The sky is blue')).toBe('the sky is blue');
  });
});

describe('Bot Responses', () => {
  test('Greets on hello', () => {
    const response = getResponse('Hello');
    expect(['Hello! How can I help you today?', 'Hi there! What\'s on your mind?']).toContain(response);
  });

  test('Reflects feeling', () => {
    const response = getResponse('I feel tired');
    expect(['Why do you feel tired?', 'What makes you feel tired?']).toContain(response);
  });

  test('Fallback on unknown', () => {
    expect(getResponse('Random text')).toBe('Tell me more about that.');
  });
});