module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: './test-results/junit',
        outputName: 'junit.xml'
      }
    ],
    [
      "jest-html-reporters",
      {
        publicPath: './test-results/html',
        filename: 'index.html',
        expand: true
      }
    ]
  ],
};