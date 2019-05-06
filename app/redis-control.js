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

  bindSubscribe(key) {
    const voidCallback = () => { };
    this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Binding subscribe`);
    if (this.actualServer > -1 && this.actualServer === key) {
      return this.connections[this.actualServer].subClient.subscribe.bind(
        this.connections[this.actualServer].subClient,
      );
    }
    return voidCallback;
  }

  bindUnsubscribe(key) {
    const voidCallback = () => { };
    this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Binding unsubscribe`);
    if (this.actualServer > -1 && this.actualServer === key) {
      return this.connections[this.actualServer].subClient.unsubscribe.bind(
        this.connections[this.actualServer].subClient,
      );
    }
    return voidCallback;
  }

  bindMessages() {
    this.connections.forEach((subElement) => {
      subElement.subClient.removeAllListeners('message');
    });
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
      this.log.debug('magenta', `Broker PID: ${this.pid} - REDIS Reset subscriptions`);
    }
  }

  listen() {
    try {
      this.connections.forEach((element, key) => {
        element.subClient.on('ready', /* istanbul ignore next */() => {
          this.log.debug('green', `Broker PID: ${this.pid} - REDIS Connected at ${element.subClient.options.host}:${element.subClient.options.port}`);
          if (this.healhServers.indexOf(key) === -1) {
            this.healhServers.push(key);
            if (this.actualServer === -1) {
              [this.actualServer] = this.healhServers;
              this.bindMessages();
              this.resubscribe();
              this.log.debug('white', `Broker PID: ${this.pid} - REDIS - Current server ${this.actualServer}`);
            }
          }
          this.log.debug('white', `Broker PID: ${this.pid} - REDIS - Health servers: ${this.healhServers}`);
        });

        element.subClient.on('reconnecting', /* istanbul ignore next */() => {
          this.log.debug('red', `Broker PID: ${this.pid} - REDIS Lost Connection with ${element.subClient.options.host}:${element.subClient.options.port} retrying in 5 seconds`);
          if (this.healhServers.indexOf(key) !== -1) {
            this.log.debug('red', `Broker PID: ${this.pid} - REDIS - Removing health server ${key}`);
            this.healhServers.splice(this.healhServers.indexOf(key), 1);
            [this.actualServer] = this.healhServers;
            this.bindMessages();
            this.resubscribe();
            this.log.debug('white', `Broker PID: ${this.pid} - REDIS - Current server ${this.actualServer}`);
          }
          this.log.debug('white', `Broker PID: ${this.pid} - REDIS - Health servers: ${this.healhServers}`);
        });

        element.subClient.on('error', /* istanbul ignore next */() => {
        });

        element.pubClient.on('error', /* istanbul ignore next */() => {
        });
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = RedisControl;
