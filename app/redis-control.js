class RedisControl {
  constructor(log, connections, pid, broker) {
    this.log = log;
    this.connections = connections;
    this.pid = pid;
    this.broker = broker;
    this.actualServer = -1;
    this.healhServers = [];
  }

  bindSubscribe(connections, key) {
    const voidCallback = () => { };
    this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Binding subscribe`);
    if (this.actualServer > -1 && this.actualServer === key) {
      return connections[this.actualServer].subClient.subscribe.bind(
        connections[this.actualServer].subClient,
      );
    }
    return voidCallback;
  }

  bindUnsubscribe(connections, key) {
    const voidCallback = () => { };
    this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Binding unsubscribe`);
    if (this.actualServer > -1 && this.actualServer === key) {
      return connections[this.actualServer].subClient.unsubscribe.bind(
        connections[this.actualServer].subClient,
      );
    }
    return voidCallback;
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
      this.log.debug('magenta', 'REDIS - Resubscribe All');
    }
  }

  listen() {
    const instanceIdRegex = /^[^\\/]*\//;
    try {
      this.connections.forEach((element, key) => {
        element.subClient.on('ready', /* istanbul ignore next */() => {
          this.log.debug('green', `Broker PID: ${this.pid} - REDIS Connected at ${element.subClient.options.host} :${element.subClient.options.port}`);
          if (this.healhServers.indexOf(key) === -1) {
            this.healhServers.push(key);
            if (this.actualServer === -1) {
              this.connections.forEach((subElement) => {
                subElement.subClient.removeAllListeners('message');
              });
              this.connections[key].subClient.addListener('message', /* istanbul ignore next */(channel, message) => {
                this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Channel ${channel} :${message} on server ${this.actualServer}`);
                let sender = null;
                const newMessage = message.replace(instanceIdRegex, (match) => {
                  sender = match.slice(0, -1);
                  return '';
                });

                if (sender == null || sender !== this.instanceId) {
                  this.broker.publish(channel, newMessage);
                }
              });
              [this.actualServer] = this.healhServers;
              this.broker.on('subscribe', this.bindSubscribe(this.connections, key));
              this.broker.on('unsubscribe', this.bindUnsubscribe(this.connections, key));
              this.resubscribe();
              this.log.debug('white', `REDIS - Current server ${this.actualServer}`);
            }
          }
          this.log.debug('white', `REDIS - Health servers: ${this.healhServers}`);
        });

        element.subClient.on('reconnecting', /* istanbul ignore next */() => {
          this.log.debug('red', `Broker PID: ${this.pid} - REDIS Lost Connection with ${element.subClient.options.host} :${element.subClient.options.port} retrying in 5 seconds`);
          if (this.healhServers.indexOf(key) !== -1) {
            this.healhServers.splice(this.healhServers.indexOf(key), 1);
            [this.actualServer] = this.healhServers;
            this.connections.forEach((subElement) => {
              subElement.subClient.removeAllListeners('message');
            });
            this.connections[this.actualServer].subClient.addListener('message', /* istanbul ignore next */(channel, message) => {
              this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Channel ${channel} :${message} on server ${this.actualServer}`);
              let sender = null;
              const newMessage = message.replace(instanceIdRegex, (match) => {
                sender = match.slice(0, -1);
                return '';
              });

              if (sender == null || sender !== this.instanceId) {
                this.broker.publish(channel, newMessage);
              }
            });
            this.broker.on('subscribe', this.bindSubscribe(this.connections, this.actualServer));
            this.broker.on('unsubscribe', this.bindUnsubscribe(this.connections, this.actualServer));
            this.resubscribe();
            this.log.debug('red', `REDIS - Removing health server ${key}`);
            this.log.debug('white', `REDIS - Current server ${this.actualServer}`);
          }
          this.log.debug('white', `REDIS - Health servers: ${this.healhServers}`);
          this.log.debug('yellow', `REDIS - Trying reconnect in 5s ${element.subClient.options.host} : ${element.subClient.options.port}`);
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
