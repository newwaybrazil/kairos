class RedisControl {
  constructor(log, connections, pid, broker) {
    this.log = log;
    this.connections = connections;
    this.pid = pid;
    this.broker = broker;
    this.actualServer = -1;
    this.healhServers = [];
    this.instanceIdRegex = /^[^\\/]*\//;
  }

  checkCurrentServer() {
    if (this.actualServer === -1 || typeof this.actualServer === 'undefined') {
      this.log.debug('white', `Broker PID: ${this.pid} - REDIS - No servers available!`);
      return false;
    }
    this.log.debug('white', `Broker PID: ${this.pid} - REDIS - Current server ${this.actualServer}`);
    return true;
  }

  checkHealthServers() {
    if (this.healhServers.length < 1) {
      this.actualServer = -1;
      this.log.debug('white', `Broker PID: ${this.pid} - REDIS - No health servers available!`);
      return false;
    }
    this.log.debug('white', `Broker PID: ${this.pid} - REDIS - Health servers: ${this.healhServers}`);
    return true;
  }

  doNothing() {
    const doNothing = /* istanbul ignore next */() => {};
    return doNothing;
  }

  bindSubscribe(key) {
    this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Binding subscribe`);
    if (this.actualServer > -1 && this.actualServer === key) {
      return this.connections[this.actualServer].subClient.subscribe.bind(
        this.connections[this.actualServer].subClient,
      );
    }
    return this.doNothing();
  }

  bindUnsubscribe(key) {
    this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Binding unsubscribe`);
    if (this.actualServer > -1 && this.actualServer === key) {
      return this.connections[this.actualServer].subClient.unsubscribe.bind(
        this.connections[this.actualServer].subClient,
      );
    }
    return this.doNothing();
  }

  bindMessages() {
    this.connections.forEach((element) => {
      element.subClient.removeAllListeners('message');
    });
    if (typeof this.actualServer !== 'undefined') {
      this.connections[this.actualServer].subClient.addListener('message', /* istanbul ignore next */(channel, message) => {
        this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Channel ${channel}: ${message} on server ${this.actualServer}`);
        let sender = null;
        const newMessage = message.replace(this.instanceIdRegex, (match) => {
          sender = match.slice(0, -1);
          return '';
        });

        if (sender == null || sender !== this.instanceId) {
          this.broker.publish(channel, newMessage);
        }
      });
      this.broker.on('subscribe', this.bindSubscribe(this.actualServer));
      this.broker.on('unsubscribe', this.bindUnsubscribe(this.actualServer));
      return true;
    }
    return false;
  }

  resubscribe() {
    const obj = Object.values(this.broker.subscriptions);
    const subObj = obj[Object.keys(obj)[0]];
    if (typeof subObj === 'object') {
      const subArray = Object.keys(subObj);
      subArray.forEach((channel) => {
        this.broker.emit('unsubscribe', [channel]);
        this.broker.emit('subscribe', [channel]);
      });
      this.log.debug('magenta', `Broker PID: ${this.pid} - REDIS - Reset subscriptions`);
      return true;
    }
    return false;
  }

  listen() {
    try {
      this.connections.forEach((element, key) => {
        element.subClient.on('ready', /* istanbul ignore next */() => {
          this.log.debug('green', `Broker PID: ${this.pid} - REDIS - Connected at ${element.subClient.options.host}:${element.subClient.options.port}`);
          if (this.healhServers.indexOf(key) === -1) {
            this.healhServers.push(key);
            if (this.actualServer === -1) {
              [this.actualServer] = this.healhServers;
              this.bindMessages();
              this.resubscribe();
              this.checkCurrentServer();
            }
          }
          this.checkHealthServers();
        });

        element.subClient.on('reconnecting', /* istanbul ignore next */() => {
          this.log.debug('red', `Broker PID: ${this.pid} - REDIS - Lost Connection with ${element.subClient.options.host}:${element.subClient.options.port} retrying in 5 seconds`);
          if (this.healhServers.indexOf(key) !== -1) {
            this.log.debug('red', `Broker PID: ${this.pid} - REDIS - Removing health server ${key}`);
            this.healhServers.splice(this.healhServers.indexOf(key), 1);
            [this.actualServer] = this.healhServers;
            this.bindMessages();
            this.resubscribe();
            this.checkCurrentServer();
          }
          this.checkHealthServers();
        });

        element.subClient.on('error', this.doNothing());

        element.pubClient.on('error', this.doNothing());
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = RedisControl;
