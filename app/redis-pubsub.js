class RedisPubSub {
  constructor(connections, log, socket) {
    this.connections = connections;
    this.log = log;
    this.socket = socket;
    this.alreadyConnected = [];
  }

  unsubscribeAll() {
    try {
      this.log.debug('red', 'REDIS - Unsubscribing all channels on servers');
      this.connections.forEach((element) => {
        element.punsubscribe('*');
        element.removeListener('pmessage', /* istanbul ignore next */() => { });
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  monitoring() {
    try {
      this.healhServers = [];
      this.actualServer = -1;

      this.connections.forEach((element, key) => {
        element.on('ready', /* istanbul ignore next */() => {
          this.log.debug('green', `REDIS - Connected ${element.options.host} :${element.options.port}`);
          this.log.debug('green', `REDIS - Adding health server ${key}`);
          if (this.healhServers.indexOf(key) === -1) {
            this.healhServers.push(key);
            [this.actualServer] = this.healhServers;
            this.unsubscribeAll();
            this.subscribe(this.actualServer);
            this.log.debug('white', `REDIS - Current server ${this.actualServer}`);
          }
          this.log.debug('white', `REDIS - Health servers: ${this.healhServers}`);
        });

        element.on('reconnecting', /* istanbul ignore next */() => {
          this.log.debug('red', `REDIS - Lost connection ${element.options.host} : ${element.options.port}`);
          if (this.healhServers.indexOf(key) !== -1) {
            this.healhServers.splice(this.healhServers.indexOf(key), 1);
            [this.actualServer] = this.healhServers;
            this.unsubscribeAll();
            this.subscribe(this.actualServer);
            this.log.debug('red', `REDIS - Removing health server ${key}`);
            this.log.debug('white', `REDIS - Current server ${this.actualServer}`);
          }
          this.log.debug('white', `REDIS - Health servers: ${this.healhServers}`);
          this.log.debug('yellow', `REDIS - Trying reconnect in 5s ${element.options.host} : ${element.options.port}`);
        });

        element.on('error', /* istanbul ignore next */() => {
          this.log.debug('red', `REDIS - Unable to connect ${element.options.host} : ${element.options.port}`);
        });
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  subscribe(actualServer) {
    try {
      this.connections[actualServer].psubscribe('*');
      /* istanbul ignore else */
      if (this.alreadyConnected.indexOf(actualServer) === -1) {
        this.alreadyConnected.push(actualServer);
        this.log.debug('white', `REDIS - Listen messages from server ${actualServer}`);
        this.connections[actualServer].addListener('pmessage', /* istanbul ignore next */ (pattern, channel, message) => {
          if (channel !== 'generic') {
            this.socket.publish(channel, message);
            this.log.debug('cyan', `SOCKET - Sending message from server ${actualServer} on channel ${channel}: ${message}`);
            return true;
          }
          this.socket.emit(message);
          this.log.debug('cyan', `SOCKET - Sending generic message from server ${this.actualServer}: ${message}`);
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = RedisPubSub;
