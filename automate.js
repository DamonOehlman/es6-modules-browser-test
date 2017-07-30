const autobrowse = require('autobrowse');

exports.runBrowser = ([testId, browser, opts], callback) => {
  autobrowse(browser, `http://localhost:8080/test/${testId}`, opts || {}, callback);
};
