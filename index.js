'use strict';

const http  = require('http');
const path  = require('path');

const debug = require('debug');

const parseArgs = require('nyks/process/parseArgs');
const defer     = require('nyks/promise/defer');
const drain     = require('nyks/stream/drain');

const logger = {
  info  : debug('sentinel:info'),
  error : debug('sentinel:error')
};

module.exports = function SingleInstanceProcess(socket_name) {
  let socketPath = path.join('\\\\?\\pipe', socket_name);
  let server     = http.createServer(async (req, res) => {
    let data    = await drain(req);
    let payload = JSON.parse(data);

    process.emit('openArgs', payload);

    res.end();
  });

  let defered = defer();

  server.unref();
  server.on('error', async (err) => {
    if(err.code === 'EADDRINUSE') {
      let req  = http.request({socketPath, method : 'POST'});
      let args = parseArgs(process.argv);

      req.end(JSON.stringify(args));

      defered.resolve(false);
      logger.error('Sentinel server already running - can\'t run more than one instance');
    } else {
      logger.error(err);
    }
  });

  server.listen(socketPath, () => {
    defered.resolve(true);
    logger.info('Sentinel server running');
  });

  return defered;
};
