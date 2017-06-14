# Bedrock ELK Logger

An node library for writing to Bedrockdata's new ELK stack.

## Installation

```bash
npm install --save git+ssh://git@github.com:bedrockdata/elk-logger-node.git#v0.0.1
```

## Usage

```coffee
# Load the Logger package
Logger = require 'bedrock-elk-logger'

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