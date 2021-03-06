'use strict';

const os    = require('os');
const http  = require('http');
const path  = require('path');

module.exports = function singleinstanceprocess(socket_name, callback) {
  const pipeDir    = process.platform == 'win32' ? '\\\\?\\pipe' : os.tmpdir();
  const socketPath = path.join(pipeDir, socket_name);
  const server     = http.createServer(async (req, res) => {
    const body = [];

    req.on('data', (buf) => body.push(buf));

    await new Promise((resolve, reject) => (req.on('end', resolve), req.on('error', reject)));

    const payload = JSON.parse(Buffer.concat(body));

    if(callback)
      callback(payload);

    res.end();
  });

  server.unref();

  return new Promise((resolve, reject) => {
    server.on('error', async (err) => {
      if(err.code === 'EADDRINUSE') {
        const req  = http.request({socketPath, method : 'POST'});

        req.end(JSON.stringify(process.argv), () => resolve(false));
      } else {
        reject(err);
      }
    });

    server.listen(socketPath, () => {
      resolve(true);
    });
  });
};

