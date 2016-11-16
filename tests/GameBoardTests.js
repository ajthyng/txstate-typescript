var assert = require('assert');

var GameBoard = require('../src/GameBoard.js');

describe('Check Board', function() {
  var testBoard;

  describe('checkBoard()', function() {
    it('should return true on horizontal.txt', function() {
      testBoard = new GameBoard("horizontal.txt");
      assert.equal(testBoard.checkBoard(), true);
    });
    it('should return true on vertical.txt', function() {
      testBoard = new GameBoard("vertical.txt");
      assert.equal(testBoard.checkBoard(), true);
    });
    it('should return true on diagonalBackSlash.txt', function() {
      testBoard = new GameBoard("diagonalBackSlash.txt");
      assert.equal(testBoard.checkBoard(), true);
    });
    it('should return true on diagonalForwardSlash.txt', function() {
      testBoard = new GameBoard("diagonalForwardSlash.txt");
      assert.equal(testBoard.checkBoard(), true);
    });
    it('should return false on checkShouldFail.txt', function() {
      testBoard = new GameBoard("checkShouldFail.txt");
      assert.equal(testBoard.checkBoard(), false);
    });
  });
});