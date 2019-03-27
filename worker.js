/* eslint-disable */
const SCWorker = require('socketcluster/scworker');
const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const healthChecker = require('sc-framework-health-check');

const Redis = require('ioredis');
const Config = require('./config/config.js');
const Log = require('./app/log.js');
const RedisPubSub = require('./app/redis-pubsub.js');
const RedisConnections = require('./app/redis-connections.js');
const Colors = require('./app/colors.js');
const DateTime = require('./app/date-time.js');
const SocketControl = require('./app/socket-control.js');

class Worker extends SCWorker {
  run() {
    const app = express();
    const { httpServer } = this;
    const { scServer } = this;

    app.use(serveStatic(path.resolve(__dirname, 'public')));
    healthChecker.attach(this, app);
    httpServer.on('request', app);

    const dateTime = new DateTime();
    const log = new Log(dateTime, Colors);
    const redisConnections = new RedisConnections(Config, Redis);
    const connections = redisConnections.connect();
    const socketControl = new SocketControl(log, scServer);

    log.debug('white', '   >> Worker PID:', process.pid);

    const pubSub = new RedisPubSub(connections, log, socketControl);
    pubSub.monitoring();
    socketControl.listen();
  }
}

new Worker();
