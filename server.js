require('dotenv').config();
const argv = require('minimist')(process.argv.slice(2));
const scHotReboot = require('sc-hot-reboot');

const SocketCluster = require('socketcluster');
const fsUtil = require('socketcluster/fsutil');

const Log = require('./app/log.js');
const Colors = require('./app/colors.js');
const DateTime = require('./app/date-time.js');
const config = require('./config/redis');
const SocketConfig = require('./config/socket');
const ValidateConfig = require('./app/validate-config');

const dateTime = new DateTime();
const log = new Log(dateTime, Colors);
const validateConfig = new ValidateConfig(log);

const { waitForFile } = fsUtil;

const workerControllerPath = argv.wc || SocketConfig.workerController;
const brokerControllerPath = argv.bc || SocketConfig.brokerController;
const workerClusterControllerPath = argv.wcc || SocketConfig.workerClusterController;

SocketConfig.logLevel = Number(argv.log) || SocketConfig.logLevel;
SocketConfig.workers = Number(argv.w) || SocketConfig.workers;
SocketConfig.brokers = Number(argv.b) || SocketConfig.brokers;
SocketConfig.port = Number(argv.p) || SocketConfig.port;
SocketConfig.clusterStateServerHost = argv.cssh || SocketConfig.clusterStateServerHost;
SocketConfig.crashWorkerOnError = argv['auto-reboot'] || SocketConfig.crashWorkerOnError;

const bootTimeout = SocketConfig.controllerBootTimeout;
const bootInterval = SocketConfig.bootCheckInterval;

function start() {
  const socketCluster = new SocketCluster(SocketConfig);
  log.debug('bright', 'Starting Kairos');

  socketCluster.on(socketCluster.EVENT_WORKER_CLUSTER_START, (workerClusterInfo) => {
    log.debug('reset', `WorkerCluster PID: ${workerClusterInfo.pid} - Starting`);
  });

  if (socketCluster.options.environment === 'dev') {
    log.debug('reset', `!! Kairos is watching for code changes in the ${__dirname} directory`);
    scHotReboot.attach(socketCluster, {
      cwd: __dirname,
      ignored: ['public', 'node_modules', 'README.md', 'Dockerfile', 'server.js', 'broker.js', /[/\\]\./, '*.log'],
    });
  }
}

const bootStartTime = Date.now();
const startWhenFileIsReady = (filePath) => {
  const errorMessage = `Failed to locate a controller file at path ${filePath} `
    + 'before SOCKETCLUSTER_CONTROLLER_BOOT_TIMEOUT';

  return waitForFile(filePath, bootInterval, bootStartTime, bootTimeout, errorMessage);
};

const filesReadyPromises = [
  startWhenFileIsReady(workerControllerPath),
  startWhenFileIsReady(brokerControllerPath),
  startWhenFileIsReady(workerClusterControllerPath),
];

Promise.all(filesReadyPromises)
  .then(() => {
    validateConfig.validate(config);
  })
  .then(() => {
    start();
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
