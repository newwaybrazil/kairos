const SCWorker = require('socketcluster/scworker');
const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const healthChecker = require('sc-framework-health-check');

const Log = require('./app/log.js');
const Colors = require('./app/colors.js');
const DateTime = require('./app/date-time.js');
const WorkerControl = require('./app/worker-control');
const SocketConfig = require('./config/socket');

const MiddlewareActions = require('./middleware/middleware-actions');

const dateTime = new DateTime();
const log = new Log(dateTime, Colors);

class Worker extends SCWorker {
  run() {
    const app = express();
    const { httpServer } = this;
    const { scServer } = this;

    app.use(serveStatic(path.resolve(__dirname, 'public')));
    healthChecker.attach(this, app);
    httpServer.on('request', app);

    if (SocketConfig.authEnable === 1) {
      scServer.addMiddleware(scServer.MIDDLEWARE_HANDSHAKE_SC, MiddlewareActions.handshake);
      scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, MiddlewareActions.actions);
      scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_IN, MiddlewareActions.actions);
      scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_OUT, MiddlewareActions.actions);
      scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, MiddlewareActions.actions);
    }

    const workerControl = new WorkerControl(log, scServer, process.pid);
    workerControl.listen();

    log.debug('cyan', `Worker PID: ${process.pid} - Starting`);
  }
}

new Worker();
