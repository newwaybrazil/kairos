/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const simple = require('simple-mock');
const { expect } = chai;
chai.use(dirtyChai);

const RedisConections = require('../app/redis-connections.js');

const config = [
  {
    host: 'localhost',
    port: 6379,
  },
  {
    host: 'localhost',
    port: 6380,
  },
];
const Redis = [];

const redisSpy = simple.spy(() => { });

describe('RedisConections', () => {

  describe('constructor', () => {
    it('should instanciate the class', () => {
      const redisConnections = new RedisConections(
        config,
        redisSpy
      );
      expect(typeof redisConnections).to.equal('object');
      expect(typeof redisConnections.connect).to.equal('function');
    });
  });

  describe('connect', () => {
    it('should connect and return an array with pub and sub connections', () => {
      const redisConnections = new RedisConections(
        config,
        redisSpy
      );
      result = redisConnections.connect();
      expect(typeof result).to.equal('object');
      expect(typeof result[0].pubClient).to.equal('object');
      expect(typeof result[1].pubClient).to.equal('object');
      expect(Object.keys(result).length).to.equal(2);
    });

    it('should not connect and return an empty array', () => {
      const redisMock = simple.mock(Redis, 'error').callFn(() => {
        throw new Error()
      });
      const redisConnections = new RedisConections(
        config,
        redisMock
      );
      result = redisConnections.connect();
      expect(typeof result).to.equal('object');
      expect(Object.keys(result).length).to.equal(0);
    });

  });

});
