/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const simple = require('simple-mock');
const { expect } = chai;
chai.use(dirtyChai);

const RedisControl = require('../app/redis-control.js');

describe('RedisControl', () => {

  describe('constructor', () => {

    it('should instanciate the class', () => {
      const redisControl = new RedisControl();
      expect(typeof redisControl).to.equal('object');
      expect(typeof redisControl.listen).to.equal('function');
    });

  });

  describe('checkCurrentServer', () => {

    it('should return false if actual server is -1', () => {
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log);
      const result = redisControl.checkCurrentServer();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should return false if actual server is undefined', () => {
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log);
      redisControl.actualServer = undefined;
      const result = redisControl.checkCurrentServer();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should return true if actual server is set', () => {
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log);
      redisControl.actualServer = 0;
      const result = redisControl.checkCurrentServer();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

  });

  describe('checkHealthServers', () => {

    it('should return false if health servers is empty', () => {
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log);
      const result = redisControl.checkHealthServers();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should return true if health servers is not empty', () => {
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log);
      redisControl.healhServers = [0];
      const result = redisControl.checkHealthServers();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

  });

  describe('doNothing', () => {

    it('return an empty function', () => {
      const redisControl = new RedisControl();
      const result = redisControl.doNothing();
      expect(typeof result).to.equal('function');
    });

  });

  describe('bindSubscribe', () => {

    it('should return an not empty function when actual server is equal the key and grater then -1', () => {
      const doNothing = () => { };
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(doNothing);
      const redisControl = new RedisControl(Log);
      const result = redisControl.bindSubscribe(0);
      expect(typeof result).to.equal('function');
    });

    it('should return an empty function when server is diff from key or equal to -1', () => {
      const Conn = new Object();
      simple.mock(Conn, 'subscribe');
      Conn.subscribe.returnWith(true);
      const connections = [
        {
          subClient: Conn,
          pubClient: Conn,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log, connections);
      redisControl.actualServer = 0;
      const result = redisControl.bindSubscribe(0);
      expect(typeof result).to.equal('function');
    });

  });

  describe('bindUnsubscribe', () => {

    it('should return an not empty function when actual server is equal the key and grater then -1', () => {
      const doNothing = () => { };
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(doNothing);
      const redisControl = new RedisControl(Log);
      const result = redisControl.bindUnsubscribe(0);
      expect(typeof result).to.equal('function');
    });

    it('should return an empty function when server is diff from key or equal to -1', () => {
      const Conn = new Object();
      simple.mock(Conn, 'unsubscribe');
      Conn.unsubscribe.returnWith(true);
      const connections = [
        {
          subClient: Conn,
          pubClient: Conn,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log, connections);
      redisControl.actualServer = 0;
      const result = redisControl.bindUnsubscribe(0);
      expect(typeof result).to.equal('function');
    });

  });

  describe('bindMessages', () => {

    it('should return true when bind messages', () => {
      const Broker = new Object();
      simple.mock(Broker, 'on');
      Broker.on.returnWith(true);

      const Conn = new Object();
      simple.mock(Conn, 'removeAllListeners');
      simple.mock(Conn, 'addListener');
      simple.mock(Conn, 'subscribe');
      simple.mock(Conn, 'unsubscribe');
      Conn.removeAllListeners.returnWith(true);
      Conn.addListener.returnWith(true);
      Conn.subscribe.returnWith(true);
      Conn.unsubscribe.returnWith(true);
      const connections = [
        {
          subClient: Conn,
          pubClient: Conn,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log, connections, 1234, Broker);
      redisControl.actualServer = 0;
      const result = redisControl.bindMessages();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should return false when not bind messages', () => {
      const Broker = new Object();
      simple.mock(Broker, 'on');
      Broker.on.returnWith(true);

      const Conn = new Object();
      simple.mock(Conn, 'removeAllListeners');
      simple.mock(Conn, 'addListener');
      simple.mock(Conn, 'subscribe');
      simple.mock(Conn, 'unsubscribe');
      Conn.removeAllListeners.returnWith(true);
      Conn.addListener.returnWith(true);
      Conn.subscribe.returnWith(true);
      Conn.unsubscribe.returnWith(true);
      const connections = [
        {
          subClient: Conn,
          pubClient: Conn,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log, connections, 1234, Broker);
      redisControl.actualServer = undefined;
      const result = redisControl.bindMessages();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

  describe('resubscribe', () => {

    it('should return true when resubscribe', () => {
      const Broker = new Object();
      simple.mock(Broker, 'emit');
      Broker.subscriptions = [
        {
          0:{
            channels: [
              'teste',
              'teste1',
            ]
          }
        }
      ];
      Broker.emit.returnWith(true);
      connections = [];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log, connections, 1234, Broker);
      const result = redisControl.resubscribe();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should return false when note resubscribe', () => {
      const Broker = new Object();
      Broker.subscriptions = [];
      connections = [];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log, connections, 1234, Broker);
      const result = redisControl.resubscribe();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

  describe('listen', () => {

    it('should return true when listen', () => {
      const Broker = new Object();
      simple.mock(Broker, 'on');
      Broker.on.returnWith(true);

      const Conn = new Object();
      simple.mock(Conn, 'on');
      Conn.on.returnWith(true);
      const connections = [
        {
          subClient: Conn,
          pubClient: Conn,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const redisControl = new RedisControl(Log, connections, 1234, Broker);
      redisControl.actualServer = 0;
      const result = redisControl.listen();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should return false when not listen', () => {
      const Conn = new Object();
      simple.mock(Conn, 'on');
      Conn.on.throwWith(new Error());
      const connections = [
        {
          subClient: Conn,
          pubClient: Conn,
        },
      ];
      const Log = new Object();
      const redisControl = new RedisControl(Log, connections);
      const result = redisControl.listen();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });


  });

});
