class SocketControl {
  constructor(log, scServer) {
    this.log = log;
    this.scServer = scServer;
  }

  publish(channel, message) {
    try {
      this.scServer.exchange.publish(channel, message);
      return true;
    } catch (error) {
      return false;
    }
  }

  emit(message) {
    try {
      Object.values(this.scServer.clients).forEach((client) => {
        client.emit('generic', message);
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  listen() {
    try {
      this.scServer.on('connection', /* istanbul ignore next */ (socket) => {
        this.log.debug('magenta', `SOCKET - Client ${socket.id} is connected`);
      });

      this.scServer.on('subscription', /* istanbul ignore next */ (socket, channel) => {
        this.log.debug('magenta', `SOCKET - Client ${socket.id} subscribe for channel ${channel}`);
      });

      this.scServer.on('unsubscription', /* istanbul ignore next */ (socket, channel) => {
        this.log.debug('magenta', `SOCKET - Client ${socket.id} unsubscribe for channel ${channel}`);
      });

      this.scServer.on('disconnection', /* istanbul ignore next */ (socket) => {
        this.log.debug('magenta', `SOCKET - Client ${socket.id} is disconnect`);
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = SocketControl;
