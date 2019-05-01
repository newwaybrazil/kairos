class WorkerControl {
  constructor(log, scServer, pid) {
    this.log = log;
    this.scServer = scServer;
    this.pid = pid;
  }

  listen() {
    try {
      this.scServer.on('connection', /* istanbul ignore next */(socket) => {
        this.log.debug('cyan', `Worker PID: ${this.pid} - Client ${socket.id} is connected`);
      });

      this.scServer.on('subscription', /* istanbul ignore next */(socket, channel) => {
        this.log.debug('cyan', `Worker PID: ${this.pid} - Client ${socket.id} subscribe for channel ${channel}`);
      });

      this.scServer.on('unsubscription', /* istanbul ignore next */(socket, channel) => {
        this.log.debug('cyan', `Worker PID: ${this.pid} - Client ${socket.id} unsubscribe for channel ${channel}`);
      });

      this.scServer.on('disconnection', /* istanbul ignore next */(socket) => {
        this.log.debug('cyan', `Worker PID: ${this.pid} - Client ${socket.id} is disconnect`);
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = WorkerControl;
