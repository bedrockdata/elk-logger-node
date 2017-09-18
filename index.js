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
        
        if(config['timeout']) {
            this.socketClient.setTimeout(config['timeout']);
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
        return new Promise((resolve, reject) => {
            this.socketClient.on('connect', () => {
                this.socketClient.end(msg + "\n");
            });
    
            this.socketClient.on('error', error => {
                reject('There was an error connecting to ' + this.getRemoteHost() + ':' + this.getRemotePort() + ' - ' + error);
            });

            this.socketClient.on('timeout', error => {
                reject('Connection to  ' + this.getRemoteHost() + ':' + this.getRemotePort() + ' timed out - ' + error);
            })
    
            this.socketClient.on('end', data => {
                this.socketClient.destroy();
                resolve();
            });
    
            this.socketClient.connect(
                this.getRemotePort(),
                this.getRemoteHost()
            );
        });
    }

    sendJSON(json) {
        return this.sendMessage(JSON.stringify(json));
    }
}

module.exports = ElkLogger;