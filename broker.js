const SCBroker = require('socketcluster/scbroker');
const scClusterBrokerClient = require('scc-broker-client');
const kairosBroker = require('./kairos-broker.js');

const Log = require('./app/log.js');
const Colors = require('./app/colors.js');
const DateTime = require('./app/date-time.js');
const BrokerControl = require('./app/broker-control');

const dateTime = new DateTime();
const log = new Log(dateTime, Colors);

class Broker extends SCBroker {
  run() {
    log.debug('yellow', `Broker PID: ${process.pid} - Starting`);

    kairosBroker.attach(this);

    const brokerControl = new BrokerControl(log, this, process.pid);
    brokerControl.listen();

    if (this.options.clusterStateServerHost) {
      scClusterBrokerClient.attach(this, {
        stateServerHost: this.options.clusterStateServerHost,
        stateServerPort: this.options.clusterStateServerPort,
        mappingEngine: this.options.clusterMappingEngine,
        clientPoolSize: this.options.clusterClientPoolSize,
        authKey: this.options.clusterAuthKey,
        stateServerConnectTimeout: this.options.clusterStateServerConnectTimeout,
        stateServerAckTimeout: this.options.clusterStateServerAckTimeout,
        stateServerReconnectRandomness: this.options.clusterStateServerReconnectRandomness,
      });
    }
  }
}

new Broker();
