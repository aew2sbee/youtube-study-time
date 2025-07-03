/**
 * Detects if a message contains Japanese greeting phrases.
 * Used to automatically award visit stamps when users post greetings.
 * 
 * @param message - The message text to analyze
 * @returns True if the message contains any of the supported greetings, false otherwise
 * 
 * @example
 * ```typescript
 * detectGreeting('おはよう！今日も頑張ります') // returns true
 * detectGreeting('こんにちは皆さん') // returns true
 * detectGreeting('勉強頑張ります') // returns false
 * ```
 * 
 * Supported greetings:
 * - おはよう (Good morning)
 * - こんにちは (Good afternoon)
 * - こんばんは (Good evening)
 */
export const detectGreeting = (message: string): boolean => {
  const normalizedMessage = message.toLowerCase().trim();
  // Check for Japanese greetings
  const greetings = ['おはよう', 'こんにちは', 'こんばんは'];
  return greetings.some((greeting) => normalizedMessage.includes(greeting));
};
