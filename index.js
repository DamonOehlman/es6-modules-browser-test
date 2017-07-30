const async = require('async');
const out = require('out');
const { createServer } = require('./server');
const { runBrowser } = require('./automate');

require('draftlog').into(console);

const configurations = [
  // out of the box browser configurations (versions at the time of writing)
  // expect 60.0
  ['chrome', 'chrome', {
    headless: true
  }],
  ['firefox', 'firefox'],  // expect 54.1
  ['safari', 'safari'],   // expect 10.1

  // chrome (same version as above) with additional command line args
  ['chrome-experiments-enabled', 'chrome', {
    headless: true,
    es6Modules: true
  }],

  // firefox (version as above) setting the flag for es6 native module support
  ['firefox-modules-enabled', 'firefox', {
    es6Modules: true
  }]
];

createServer(8080, (err, server) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // have the server monitor for each of the configured testIds
  const serverExpectations = configurations.map(([testId]) => {
    const draft = console.draft(`⏳  ${testId} checking...`);

    return server.expect(testId)
      .then(() => {
        draft(`✅  ${testId}`)
      })
      .catch((err) => {
        draft(`❌  ${testId}`);
      });
  });

  async.map(configurations, runBrowser, (err, automators) => {
    if (err) {
      console.error('Error encountered running the selected browsers, shutting down');
      process.exit(1);
    }

    Promise.all(serverExpectations).then(() => {
      automators.forEach(automator => automator.kill());
      server.close();

      process.exit(0); // becuase we have no control over safari
    });
  });
});
