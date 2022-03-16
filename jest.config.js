export default {
  moduleFileExtensions: ['js','json', 'ts'],
  roots: ['<rootDir>/test'],
  testEnvironment: "node",
  testRegex: '.(t|j)s$',
  transform: {
    "(^.+\\.(ts|tsx)$)|(node-fetch)|(data-uri-to-buffer)|(fetch-blob)/.*\.[cm]?js$": "ts-jest",
    "\.esm\.(min)?\.js$": "ts-jest",
    "^.+\\.(js)$": "babel-jest",
  },
  transformIgnorePatterns: [
  ],
}
