const net = require('net');

class ElkLogger {
    /**
     * @param {Object} config 
     */
    constructor(config) {
        this.config = {
            'remote-host': config['remote-host'],
            'remote-port': config['remote-port'],
            'timeout':     config['timeout'] || 2000,
            'socket':      config['socket-client'],
        };
    }

    getRemoteHost() {
        return this.config['remote-host'];
    }

    getRemotePort() {
        return this.config['remote-port'];
    }
    
    getTimeout() {
        return this.config['timeout'];
    }
    
    createNewSocket() {
        let socket;

        if (this.config['socket']) {
            socket = this.config['socket'];
        } else {
            socket = new net.Socket();
        }

        socket.setTimeout(this.getTimeout());
        
        return socket;
    }

    sendMessage(msg) {
        const socket = this.createNewSocket();

        return new Promise((resolve, reject) => {
            socket.on('connect', () => {
                socket.end(msg + "\n");
            });
    
            socket.on('error', error => {
                reject('There was an error connecting to ' + this.getRemoteHost() + ':' + this.getRemotePort() + ' - ' + error);
            });

            socket.on('timeout', error => {
                reject('Connection to  ' + this.getRemoteHost() + ':' + this.getRemotePort() + ' timed out - ' + error);
            })
    
            socket.on('end', data => {
                socket.destroy();
                resolve();
            });
    
            socket.connect(
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