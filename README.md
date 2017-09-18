# TCP ELK Logger

An node library for writing messages to a TCP socket.  Made specifically for interfacing with a Logstash instance
configured with [the TCP input](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-tcp.html) plugin.

## Installation

```bash
npm install --save git+ssh://git@github.com:bedrockdata/elk-logger-node.git#v0.0.1
```

## Usage

```coffee
# Load the Logger package
Logger = require 'tcp-elk-logger'

# Create a logger object
logger = new Logger({'remote-host': '10.0.1.125', 'remote-port': '9999'})

# Send a log message
logger.sendMessage 'Testing from node!'
```

## Contributing

* Run `npm run tdd`
* Add a test to test/index.js
* Add your code changes to index.js
* Run `npm run babel`