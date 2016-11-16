/// <reference path="../typings/globals/node/index.d.ts"/>
'use strict';
var fs = require('fs');
var GameBoard = (function () {
    function GameBoard(filename) {
        this.dimensionError = "Invalid Grid Dimensions, must be N x N";
        var fullPath = __dirname + '\\' + filename;
        this.loadFromFile(fullPath);
    }
    /**
     * Synchronously loads a space delimited NxN grid of single characters into a two dimensional
     * array.
     * @param fullPath The full system path of a a file to load.
     */
    GameBoard.prototype.loadFromFile = function (fullPath) {
        var gridContents = fs.readFileSync(fullPath).toString();
        gridContents = gridContents.split('\r\n');
        for (var i = 0; i < gridContents.length; i++) {
            gridContents[i] = gridContents[i].split(' ');
            if (gridContents[i].length != gridContents.length)
                throw this.dimensionError;
        }
        this.gameBoard = gridContents;
    };
    /**
     * Checks the NxN board for 4 pieces of the same color in a row, column, or diagonal.
     * @returns {boolean} True if the board contains 4 of the same colored piece in a row, column, or diagonal
     */
    GameBoard.prototype.checkBoard = function () {
        return this.checkHorizontal() || this.checkVertical() || this.checkDiagonal();
    };
    GameBoard.prototype.checkHorizontal = function () {
        var rows = this.gameBoard.length;
        for (var row = 0; row < rows; row++) {
            if (this.hasFourInRow(row))
                return true;
        }
        return false;
    };
    GameBoard.prototype.hasFourInRow = function (row) {
        var redCount = 0, blackCount = 0;
        var cols = this.gameBoard[row].length;
        for (var col = 0; col < cols; col++) {
            var piece = this.gameBoard[row][col];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            }
            else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            }
            else {
                blackCount = 0;
                redCount = 0;
            }
            if (GameBoard.isFour(blackCount, redCount))
                return true;
        }
        return false;
    };
    GameBoard.isFour = function (black, red) {
        return red >= 4 || black >= 4;
    };
    GameBoard.isBlack = function (piece) {
        return piece == 'B';
    };
    GameBoard.isRed = function (piece) {
        return piece == 'R';
    };
    GameBoard.prototype.checkVertical = function () {
        var cols = this.gameBoard[0].length;
        for (var col = 0; col < cols; col++) {
            if (this.hasFourInCol(col))
                return true;
        }
        return false;
    };
    GameBoard.prototype.hasFourInCol = function (col) {
        var redCount = 0, blackCount = 0;
        var rows = this.gameBoard.length;
        for (var row = 0; row < rows; row++) {
            var piece = this.gameBoard[row][col];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            }
            else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            }
            else {
                redCount = 0;
                blackCount = 0;
            }
            if (GameBoard.isFour(blackCount, redCount))
                return true;
        }
        return false;
    };
    GameBoard.prototype.checkDiagonal = function () {
        return this.checkBackSlash() || this.checkForwardSlash();
    };
    GameBoard.prototype.checkForwardSlash = function () {
        var finalRow = this.gameBoard.length - 4;
        var startingCol = this.gameBoard.length - 1;
        var finalCol = 3;
        for (var row = 0; row <= finalRow; row++) {
            if (this.checkForwardSlashRows(row))
                return true;
        }
        for (var col = startingCol; col >= finalCol; col--) {
            if (this.checkForwardSlashCols(col))
                return true;
        }
        return false;
    };
    GameBoard.prototype.checkForwardSlashRows = function (row) {
        var lastCol = this.gameBoard.length - 1;
        var redCount = 0;
        var blackCount = 0;
        for (var currentCol = lastCol; currentCol >= row; currentCol--) {
            var rowOffset = lastCol - currentCol;
            var piece = this.gameBoard[row + rowOffset][currentCol];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            }
            else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            }
            else {
                redCount = 0;
                blackCount = 0;
            }
        }
        return GameBoard.isFour(blackCount, redCount);
    };
    GameBoard.prototype.checkForwardSlashCols = function (col) {
        var redCount = 0;
        var blackCount = 0;
        for (var row = 0; row <= col; row++) {
            var piece = this.gameBoard[row][col - row];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            }
            else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            }
            else {
                redCount = 0;
                blackCount = 0;
            }
        }
        return GameBoard.isFour(blackCount, redCount);
    };
    GameBoard.prototype.checkBackSlash = function () {
        var finalRow = this.gameBoard.length - 3;
        var finalCol = this.gameBoard[0].length - 3;
        for (var row = 0; row <= finalRow; row++) {
            if (this.checkBackSlashRows(row))
                return true;
        }
        for (var col = 0; col <= finalCol; col++) {
            if (this.checkBackSlashCols(col))
                return true;
        }
    };
    GameBoard.prototype.checkBackSlashCols = function (col) {
        var rows = this.gameBoard.length - col;
        var redCount = 0;
        var blackCount = 0;
        for (var row = 0; row < rows; row++) {
            var piece = this.gameBoard[row][col + row];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            }
            else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            }
            else {
                redCount = 0;
                blackCount = 0;
            }
        }
        return GameBoard.isFour(blackCount, redCount);
    };
    GameBoard.prototype.checkBackSlashRows = function (row) {
        var cols = this.gameBoard.length - row;
        var redCount = 0;
        var blackCount = 0;
        for (var col = 0; col < cols; col++) {
            var piece = this.gameBoard[row + col][col];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            }
            else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            }
            else {
                redCount = 0;
                blackCount = 0;
            }
        }
        return GameBoard.isFour(blackCount, redCount);
    };
    GameBoard.prototype.toString = function () {
        return this.gameBoard.toString();
    };
    return GameBoard;
}());
module.exports = GameBoard;
