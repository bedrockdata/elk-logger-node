const ElkLogger = require('../index.js');

const net       = require('net');

const chai      = require('chai'); 
const expect    = require('chai').expect;
const sinon     = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('bedrock-elk-logger', function() {
  describe('constructor', function() {
    it('shall accept a remote host configuraton', function() {
      const elkConfig = {'remote-host': 'test'};
      const elkLogger = new ElkLogger(elkConfig);

      expect(elkLogger.getRemoteHost()).to.equal(elkConfig['remote-host']);
    });

    it('shall accept a remote port configuraton', function() {
      const elkConfig = {'remote-port': '1337'};
      const elkLogger = new ElkLogger(elkConfig);

      expect(elkLogger.getRemotePort()).to.equal(elkConfig['remote-port']);
    });

    it('shall accept an optional configuation parameter for the net socket client', function() {
      const elkConfig = {'socket-client': new net.Socket()};
      const elkLogger = new ElkLogger(elkConfig);

      expect(elkLogger.getSocketClient()).to.equal(elkConfig['socket-client']);
    });
  });

  describe('sendMessage', function() {
    it('shall connect to the remote host via tcp socket using the constructor config parameters', function() {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};

      const mock = sinon.mock(socket)
        .expects('connect')
        .withArgs(elkConfig['remote-port'], elkConfig['remote-host']);

      const elkLogger = new ElkLogger(elkConfig);
      elkLogger.sendMessage('...');

      mock.verify();
    });

    it('shall write the message to the socket client', function() {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';

      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('connect');
      });

      const mock = sinon
        .mock(socket)
        .expects('write')
        .withArgs(message)
        .once();

      const elkLogger = new ElkLogger(elkConfig);
      elkLogger.sendMessage(message);

      mock.verify();
    });

    it('shall close the tcp connection after writing', function() {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';

      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('connect');
      });

      sinon.stub(socket, 'write');

      const mock = sinon
        .mock(socket)
        .expects('destroy')
        .once();

      const elkLogger = new ElkLogger(elkConfig);
      elkLogger.sendMessage(message);

      mock.verify();
    });

    it('shall handle connection errors by logging to the console', function() {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';

      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('error');  
      });

      elkConfig['socket-client'] = socket;
      const elkLogger = new ElkLogger(elkConfig);

      expect(() => elkLogger.sendMessage(message)).to.not.throw();
    });
  });

  describe('sendJSON', function() {
    it('shall call sendMessage with a stringified version of the JSON message', function() {
      const elkLogger = new ElkLogger({'remote-host': 'test', 'remote-port': '1337'});
      const message   = {message: 'test message'};

      const mock = sinon
        .mock(elkLogger)
        .expects('sendMessage')
        .withArgs(JSON.stringify(message));
        
      elkLogger.sendJSON(message);
      mock.verify();
    })
  })
});