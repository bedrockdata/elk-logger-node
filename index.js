const net = require('net');

class ElkLogger {
    /**
     * @param {Object} config 
     */
    constructor(config) {
        this.config = {
            'remote-host': config['remote-host'],
            'remote-port': config['remote-port'],
        };

        if (config['socket-client']) {
            this.socketClient = config['socket-client'];
        } else {
            this.socketClient = new net.Socket();
        }
    }

    getRemoteHost() {
        return this.config['remote-host'];
    }

    getRemotePort() {
        return this.config['remote-port'];
    }

    getSocketClient() {
        return this.socketClient;
    }

    sendMessage(msg) {
        this.socketClient.on('connect', () => {
            this.socketClient.write(msg);
            this.socketClient.destroy();
        });

        this.socketClient.on('error', error => {
            console.log('There was an error connecting to ' + this.getRemoteHost() + ':' + this.getRemotePort() + ' - ' + error);
        });

        this.socketClient.on('data', data => {
            console.log('Response from ' + this.getRemoteHost() + ': ' + data);
        });

        this.socketClient.connect(
            this.getRemotePort(),
            this.getRemoteHost()
        );
    } 
}

module.exports = ElkLogger;