/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = chai;
chai.use(dirtyChai);

const colors = require('../app/colors.js');

describe('Colors', () => {

  describe('array', () => {

    it('should have a white key', () => {
      expect(typeof colors).to.equal('object');
    });

    it('white key must be string', () => {
      expect(typeof colors.white).to.equal('string');
    });

    it('white key must be equal to white code', () => {
      expect(colors.white).to.equal('\x1b[37m%s\x1b[0m');
    });

  });

});
