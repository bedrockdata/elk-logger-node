'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var net = require('net');

var ElkLogger = function () {
    /**
     * @param {Object} config 
     */
    function ElkLogger(config) {
        _classCallCheck(this, ElkLogger);

        this.config = {
            'remote-host': config['remote-host'],
            'remote-port': config['remote-port'],
            'timeout': config['timeout'] || 2000,
            'socket': config['socket-client']
        };
    }

    _createClass(ElkLogger, [{
        key: 'getRemoteHost',
        value: function getRemoteHost() {
            return this.config['remote-host'];
        }
    }, {
        key: 'getRemotePort',
        value: function getRemotePort() {
            return this.config['remote-port'];
        }
    }, {
        key: 'getTimeout',
        value: function getTimeout() {
            return this.config['timeout'];
        }
    }, {
        key: 'createNewSocket',
        value: function createNewSocket() {
            var socket = void 0;

            if (this.config['socket']) {
                socket = this.config['socket'];
            } else {
                socket = new net.Socket();
            }

            socket.setTimeout(this.getTimeout());

            return socket;
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(msg) {
            var _this = this;

            var socket = this.createNewSocket();

            return new Promise(function (resolve, reject) {
                socket.on('connect', function () {
                    socket.end(msg + "\n");
                });

                socket.on('error', function (error) {
                    reject('There was an error connecting to ' + _this.getRemoteHost() + ':' + _this.getRemotePort() + ' - ' + error);
                });

                socket.on('timeout', function (error) {
                    reject('Connection to  ' + _this.getRemoteHost() + ':' + _this.getRemotePort() + ' timed out - ' + error);
                });

                socket.on('end', function (data) {
                    socket.destroy();
                    resolve();
                });

                socket.connect(_this.getRemotePort(), _this.getRemoteHost());
            });
        }
    }, {
        key: 'sendJSON',
        value: function sendJSON(json) {
            return this.sendMessage(JSON.stringify(json));
        }
    }]);

    return ElkLogger;
}();

module.exports = ElkLogger;
