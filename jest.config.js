module.exports = {
  moduleFileExtensions: ['js','json', 'ts'],
  roots: ['<rootDir>/test'],
  testEnvironment: "node",
  testRegex: '.spec.(t|j)s$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
}
