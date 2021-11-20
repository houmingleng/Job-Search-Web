#!/usr/bin/env node

const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(Number(process.env.PORT || 3001), () => {
  console.log(`Listening on ${process.env.PORT || 3001}.`);
});
