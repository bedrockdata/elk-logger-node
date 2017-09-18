const ElkLogger = require('../index.js');

const net       = require('net');

const chai      = require('chai'); 
const expect    = require('chai').expect;
const sinon     = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('tcp-elk-logger', function() {
  describe('constructor', function() {
    it('shall accept a remote host configuration', function() {
      const elkConfig = {'remote-host': 'test'};
      const elkLogger = new ElkLogger(elkConfig);

      expect(elkLogger.getRemoteHost()).to.equal(elkConfig['remote-host']);
    });
    
    it('shall accept a remote port configuration', function() {
      const elkConfig = {'remote-port': '1337'};
      const elkLogger = new ElkLogger(elkConfig);

      expect(elkLogger.getRemotePort()).to.equal(elkConfig['remote-port']);
    });
        
    it('shall accept an optional timeout parameter', function() {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'timeout': 'some timeout', 'socket-client': socket = new net.Socket()};

      const mock = sinon
      .mock(socket)
      .expects('setTimeout')
      .withArgs(elkConfig['timeout'])
      .once();

      const elkLogger = new ElkLogger(elkConfig);

      mock.verify();
    });

    it('shall accept an optional configuration parameter for the net socket client', function() {
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

    it('shall write the message to the socket client, appending a newline', function() {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';

      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('connect');
      });

      const mock = sinon
        .mock(socket)
        .expects('end')
        .withArgs(message + "\n")
        .once();

      const elkLogger = new ElkLogger(elkConfig);
      elkLogger.sendMessage(message);

      mock.verify();
    });

    it('shall destroy the tcp connection after writing', function() {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';

      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('end');
      });

      const mock = sinon
        .mock(socket)
        .expects('destroy')
        .once();

      const elkLogger = new ElkLogger(elkConfig);
      elkLogger.sendMessage(message);

      mock.verify();
    });

    it('shall return a promise', function() {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';
      
      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('end');
      });

      const elkLogger = new ElkLogger(elkConfig);
      const promise   = elkLogger.sendMessage(message);

      expect(promise).to.be.a('Promise');
    });

    it('shall resolve the promise after "end" is emitted', function(done) {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';

      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('end');
      });

      const elkLogger = new ElkLogger(elkConfig);
      elkLogger.sendMessage(message).then(
        () => done(),
        () => done('sendMessage promise rejected, it was expected to resolve.')
      );
    });
    
    it('shall reject the promise if "error" is emitted', function(done) {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';

      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('error');  
      });

      const elkLogger = new ElkLogger(elkConfig);
      elkLogger.sendMessage(message).then(
        () => done('sendMessage promise resolved, it was expected to reject.'),
        () => done()
      );
    });
    
    it('shall reject the promise if "timeout" is emitted', function(done) {
      const elkConfig = {'remote-host': 'test', 'remote-port': '1337', 'socket-client': socket = new net.Socket()};
      const message   = 'test message';

      sinon.stub(socket, 'connect').callsFake(() => {
        socket.emit('timeout');  
      });

      const elkLogger = new ElkLogger(elkConfig);
      elkLogger.sendMessage(message).then(
        () => done('sendMessage promise resolved, it was expected to reject.'),
        () => done()
      );
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
    });
  });
});