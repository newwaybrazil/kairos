/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const simple = require('simple-mock');
const { expect } = chai;
chai.use(dirtyChai);

const SocketControl = require('../app/socket-control.js');

const socketSpy = simple.spy(() => { });
const logSpy = simple.spy(() => { });

describe('SocketControl', () => {

  describe('constructor', () => {
    it('should instanciate the class', () => {
      const socketControl = new SocketControl(
        logSpy,
        socketSpy
      );
      expect(typeof socketControl).to.equal('object');
      expect(typeof socketControl.publish).to.equal('function');
    });
  });

  describe('publish', () => {
    it('should publish and return true', () => {
      const ScServer = new Object();
      simple.mock(ScServer, 'publish');
      ScServer.publish.returnWith(true);
      const objectSocket = {
        exchange: ScServer,
      };
      const socketControl = new SocketControl(
        logSpy,
        objectSocket
      );
      result = socketControl.publish('channel1', 'message');
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('error on publish return false', () => {
      const ScServer2 = new Object();
      simple.mock(ScServer2, 'publish');
      ScServer2.publish.throwWith(new Error());
      const objectSocket2 = {
        exchange: ScServer2,
      };
      const socketControl = new SocketControl(
        logSpy,
        objectSocket2
      );
      result = socketControl.publish('channel1', 'message');
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

  describe('emit', () => {

    it('should emit and return true', () => {
      const ScServer3 = new Object();
      simple.mock(ScServer3, 'emit');
      ScServer3.emit.returnWith(true);
      const objectSocket3 = {
        clients: {
          ScServer3,
          ScServer3
        }
      };
      const socketControl3 = new SocketControl(
        logSpy,
        objectSocket3
      );
      result = socketControl3.emit('message');
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should not emit and return false', () => {
      const ScServer4 = new Object();
      simple.mock(ScServer4, 'emit');
      ScServer4.emit.throwWith(new Error());
      const objectSocket4 = {
        clients: {
          ScServer4,
          ScServer4
        }
      };
      const socketControl4 = new SocketControl(
        logSpy,
        objectSocket4
      );
      result = socketControl4.emit('message');
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

  describe('listen', () => {

    it('should listen and return true', () => {
      const ScServer5 = new Object();
      simple.mock(ScServer5, 'on');
      ScServer5.on.returnWith(true);
      const socketControl5 = new SocketControl(
        logSpy,
        ScServer5
      );
      result = socketControl5.listen();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should not listen and return false', () => {
      const ScServer6 = new Object();
      simple.mock(ScServer6, 'on');
      ScServer6.on.throwWith(new Error());
      const socketControl6 = new SocketControl(
        logSpy,
        ScServer6
      );
      result = socketControl6.listen((isValid) => {
        assert.equal(isValid, true);
        done();
      });
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

});

