/** @type {import('prettier').Config} */
module.exports = {
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  trailingComma: 'es5',
  printWidth: 80,
  endOfLine: 'lf',
  arrowParens: 'avoid',
  bracketSpacing: true,
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};
