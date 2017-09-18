# docker build --tag elk-logger-node --rm .
# docker run --volume $(pwd):/usr/src/app elk-logger-node npm install
# docker run --volume $(pwd):/usr/src/app elk-logger-node npm run tdd
FROM node:8.4.0-alpine

WORKDIR /usr/src/app