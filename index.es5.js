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
            'remote-port': config['remote-port']
        };

        if (config['socket-client']) {
            this.socketClient = config['socket-client'];
        } else {
            this.socketClient = new net.Socket();
        }
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
        key: 'getSocketClient',
        value: function getSocketClient() {
            return this.socketClient;
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(msg) {
            var _this = this;

            this.socketClient.on('connect', function () {
                _this.socketClient.write(msg);
                _this.socketClient.destroy();
            });

            this.socketClient.on('error', function (error) {
                console.log('There was an error connecting to ' + _this.getRemoteHost() + ':' + _this.getRemotePort() + ' - ' + error);
            });

            this.socketClient.on('data', function (data) {
                console.log('Response from ' + _this.getRemoteHost() + ': ' + data);
            });

            this.socketClient.connect(this.getRemotePort(), this.getRemoteHost());
        }
    }, {
        key: 'sendJSON',
        value: function sendJSON(json) {
            this.sendMessage(JSON.stringify(json));
        }
    }]);

    return ElkLogger;
}();

module.exports = ElkLogger;
