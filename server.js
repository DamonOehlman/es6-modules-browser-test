const http = require('http');
const path = require('path');
const express = require('express');

class TestServer {
  constructor(port) {
    this.port = port;
    this.url = `http://localhost:${port}`;

    this.app = null;
    this.server = null;
  }

  static create(port) {
    return new TestServer(port);
  }

  start(callback) {
    const app = this.app = express();
    app.use(express.static('static/js'))
    this.server = app.listen(this.port, callback);
  }

  expect(testId) {
    if (!this.app) {
      return Promise.reject('no application running');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timed out')), 5e3);
      this.app.get(`/test/${testId}/data`, (req, res) => {
        clearTimeout(timeout);
        res.send('ok');
        resolve('received request');
      });

      this.app.get(`/test/${testId}`, (req, res) => {
        res.set('Content-Type', 'text/html');
        res.sendFile(path.resolve(__dirname, 'static/index.html'));
      });
    });
  }

  close() {
    this.server && this.server.close();
  }
}

exports.createServer = (port, callback) => {
  const server = TestServer.create(port);
  server.start((err) => callback(err, server));
};
