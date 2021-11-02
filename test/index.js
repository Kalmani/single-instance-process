'use strict';

const expect   = require('expect.js');

const sip      = require('../');
const PIPE_KEY = 'testSIP';

describe('Testing single-instance-process', () => {
  it('should connect to sip and launch server', async () => {
    let isServer = await sip(PIPE_KEY);

    expect(isServer).to.be(true);
  });

  it('should connect to sip and be a client', async () => {
    let isServer = await sip(PIPE_KEY);

    expect(isServer).to.be(false);
  });

  /*it('should send param to main server', (done) => {
    let processArg = '--jambon=melon';

    process.argv.push(processArg);

    process.on('openArgs', (args) => {
      let sentArg = args[4];

      expect(sentArg).to.eql(processArg);
      done();
    });

    sip(PIPE_KEY);
  });*/

  /*it('should fail to create or connect to server', async () => {
    var catched = null;

    try {
      console.log('before');
      var test = await sip('usedFile');
      console.log('after', test);
    } catch(err) {
      console.log('this is error', err);
      catched = err.code;
    }

    expect(catched).to.be.ok();
  });*/
});
