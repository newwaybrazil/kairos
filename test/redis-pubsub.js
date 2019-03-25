/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const simple = require('simple-mock');
const { expect } = chai;
chai.use(dirtyChai);

const RedisPubSub = require('../app/redis-pubsub.js');
const connectionsSpy = simple.spy(() => { });
const logSpy = simple.spy(() => { });
const socketSpy = simple.spy(() => { });
const logMock = new Object();
simple.mock(logMock, 'debug');
logMock.debug.returnWith(true);

describe('RedisPubSub', () => {

  describe('constructor', () => {

    it('should instanciate the class', () => {
      const redisPubSub = new RedisPubSub(
        connectionsSpy,
        logSpy,
        socketSpy
      );
      expect(typeof redisPubSub).to.equal('object');
      expect(typeof redisPubSub.unsubscribeAll).to.equal('function');
    });

  });

  describe('unsubscribeAll', () => {

    it('should unsubscribe and return true', () => {
      const connectionMock = new Object();
      simple.mock(connectionMock, 'removeListener');
      connectionMock.removeListener.returnWith(true);
      simple.mock(connectionMock, 'punsubscribe');
      connectionMock.punsubscribe.returnWith(true);
      const objectConnections = [
        connectionMock,
        connectionMock
      ];
      const redisPubSub = new RedisPubSub(
        objectConnections,
        logMock,
        socketSpy
      );
      result = redisPubSub.unsubscribeAll()
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should not unsubscribe and return false', () => {
      const connectionMock2 = new Object();
      simple.mock(connectionMock2, 'removeListener');
      connectionMock2.removeListener.returnWith(true);
      simple.mock(connectionMock2, 'punsubscribe');
      connectionMock2.punsubscribe.throwWith(new Error());
      const objectConnections2 = [
        connectionMock2,
        connectionMock2
      ];
      const redisPubSub2 = new RedisPubSub(
        objectConnections2,
        logMock,
        socketSpy
      );
      result = redisPubSub2.unsubscribeAll()
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

  describe('monitoring', () => {

    it('should monitore and return true', () => {
      const connectionMock3 = new Object();
      simple.mock(connectionMock3, 'removeListener');
      connectionMock3.removeListener.returnWith(true);
      simple.mock(connectionMock3, 'punsubscribe');
      connectionMock3.punsubscribe.returnWith(true);
      simple.mock(connectionMock3, 'psubscribe');
      connectionMock3.psubscribe.returnWith(true);
      simple.mock(connectionMock3, 'on');
      connectionMock3.on.returnWith(true);
      const socketMock3 = new Object();
      simple.mock(socketMock3, 'publish');
      socketMock3.publish.returnWith(true);
      simple.mock(socketMock3, 'emit');
      socketMock3.emit.returnWith(true);
      const objectConnections3 = [
        connectionMock3,
        connectionMock3
      ];
      const redisPubSub3 = new RedisPubSub(
        objectConnections3,
        logMock,
        socketMock3
      );
      monitoring = redisPubSub3.monitoring();
      expect(typeof monitoring).to.equal('boolean');
      expect(monitoring).to.equal(true);
    });

    it('should not monitoring and return false', () => {
      const objectConnections4 = '';
      const redisPubSub4 = new RedisPubSub(
        objectConnections4,
        logSpy,
        socketSpy
      );
      monitoring = redisPubSub4.monitoring();
      expect(typeof monitoring).to.equal('boolean');
      expect(monitoring).to.equal(false);
    });

  });

  describe('subscribe', () => {

    it('should subscribe and return true', () => {
      const connectionMock3 = new Object();
      simple.mock(connectionMock3, 'removeListener');
      connectionMock3.removeListener.returnWith(true);
      simple.mock(connectionMock3, 'punsubscribe');
      connectionMock3.punsubscribe.returnWith(true);
      simple.mock(connectionMock3, 'psubscribe');
      connectionMock3.psubscribe.returnWith(true);
      simple.mock(connectionMock3, 'addListener');
      connectionMock3.addListener.returnWith(true);
      simple.mock(connectionMock3, 'on');
      connectionMock3.on.returnWith(true);
      const socketMock3 = new Object();
      simple.mock(socketMock3, 'publish');
      socketMock3.publish.returnWith(true);
      simple.mock(socketMock3, 'emit');
      socketMock3.emit.returnWith(true);
      const objectConnections3 = [
        connectionMock3,
        connectionMock3
      ];
      const redisPubSub3 = new RedisPubSub(
        objectConnections3,
        logMock,
        socketMock3
      );
      result = redisPubSub3.subscribe(0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should not subscribe and return false', () => {
      const connectionMock3 = new Object();
      simple.mock(connectionMock3, 'removeListener');
      connectionMock3.removeListener.returnWith(true);
      simple.mock(connectionMock3, 'punsubscribe');
      connectionMock3.punsubscribe.returnWith(true);
      simple.mock(connectionMock3, 'psubscribe');
      connectionMock3.psubscribe.throwWith(new Error());
      simple.mock(connectionMock3, 'addListener');
      connectionMock3.addListener.returnWith(true);
      simple.mock(connectionMock3, 'on');
      connectionMock3.on.returnWith(true);
      const socketMock3 = new Object();
      simple.mock(socketMock3, 'publish');
      socketMock3.publish.returnWith(true);
      simple.mock(socketMock3, 'emit');
      socketMock3.emit.returnWith(true);
      const objectConnections3 = [
        connectionMock3,
        connectionMock3
      ];
      const redisPubSub3 = new RedisPubSub(
        objectConnections3,
        logMock,
        socketMock3
      );
      result = redisPubSub3.subscribe(0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

});
