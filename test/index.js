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

  it('should fail to create or connect to server', async () => {
    var catched = '';

    try {
      await sip('');
    } catch(err) {
      catched = err.code;
    }

    expect(catched).to.not.be.empty();
  });
});
