/// <reference path="../typings/globals/node/index.d.ts"/>
'use strict';
const fs = require('fs');

class GameBoard {
    private gameBoard: Array<string>;
    private dimensionError = "Invalid Grid Dimensions, must be N x N";

    constructor (filename: string) {
        let fullPath = __dirname + '\\' + filename;
        this.loadFromFile(fullPath);
    }

    /**
     * Synchronously loads a space delimited NxN grid of single characters into a two dimensional
     * array.
     * @param fullPath The full system path of a a file to load.
     */
    private loadFromFile(fullPath: string) {
        let gridContents = fs.readFileSync(fullPath).toString();
        gridContents = gridContents.split('\r\n');
        for (let i = 0; i < gridContents.length; i++) {
            gridContents[i] = gridContents[i].split(' ');
            if (gridContents[i].length != gridContents.length) throw this.dimensionError;
        }
        this.gameBoard = gridContents;
    }

    /**
     * Checks the NxN board for 4 pieces of the same color in a row, column, or diagonal.
     * @returns {boolean} True if the board contains 4 of the same colored piece in a row, column, or diagonal
     */
    public checkBoard() {
        return this.checkHorizontal() || this.checkVertical() || this.checkDiagonal();
    }

    private checkHorizontal() {
        let rows = this.gameBoard.length;
        for (let row = 0; row < rows; row++) {
            if (this.hasFourInRow(row)) return true;
        }
        return false;
    }

    private hasFourInRow(row: number) {
        let redCount = 0, blackCount = 0;
        let cols = this.gameBoard[row].length;
        for (let col = 0; col < cols; col++) {
            let piece = this.gameBoard[row][col];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            }
            else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            } else {
                blackCount = 0;
                redCount = 0;
            }
            if (GameBoard.isFour(blackCount, redCount)) return true;
        }
        return false;
    }

    private static isFour(black: number, red: number) {
        return red >= 4 || black >= 4;
    }

    private static isBlack(piece: string) {
        return piece == 'B';
    }

    private static isRed(piece: string) {
        return piece == 'R';
    }

    private checkVertical() {
        let cols = this.gameBoard[0].length;
        for (let col = 0; col < cols; col++) {
            if (this.hasFourInCol(col)) return true;
        }
        return false;
    }

    private hasFourInCol(col: number) {
        let redCount = 0, blackCount = 0;
        let rows = this.gameBoard.length;
        for (let row = 0; row < rows; row++) {
            let piece = this.gameBoard[row][col];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            } else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            } else {
                redCount = 0;
                blackCount = 0;
            }
            if (GameBoard.isFour(blackCount, redCount)) return true;
        }
        return false;
    }

    private checkDiagonal() {
        return this.checkBackSlash() || this.checkForwardSlash();
    }

    private checkForwardSlash() {
        let finalRow = this.gameBoard.length - 4;
        let startingCol = this.gameBoard.length - 1;
        let finalCol = 3;
        for (let row = 0; row <= finalRow; row++) {
            if (this.checkForwardSlashRows(row)) return true;
        }
        for (let col = startingCol; col >= finalCol; col--) {
            if (this.checkForwardSlashCols(col)) return true;
        }
        return false;
    }

    private checkForwardSlashRows(row: number) {
        let lastCol = this.gameBoard.length - 1;
        let redCount = 0;
        let blackCount = 0;

        for (let currentCol = lastCol; currentCol >= row; currentCol--) {
            let rowOffset = lastCol - currentCol;
            let piece = this.gameBoard[row + rowOffset][currentCol];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            } else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            } else {
                redCount = 0;
                blackCount = 0;
            }
        }
        return GameBoard.isFour(blackCount, redCount);
    }

    private checkForwardSlashCols(col: number) {
        let redCount = 0;
        let blackCount = 0;

        for (let row = 0; row <= col; row++) {
            let piece = this.gameBoard[row][col - row];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            } else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            } else {
                redCount = 0;
                blackCount = 0;
            }
        }
        return GameBoard.isFour(blackCount, redCount);
    }

    private checkBackSlash() {
        let finalRow = this.gameBoard.length - 3;
        let finalCol = this.gameBoard[0].length - 3;

        for (let row = 0; row <= finalRow; row++) {
            if (this.checkBackSlashRows(row)) return true;
        }

        for (let col = 0; col <= finalCol; col++) {
            if (this.checkBackSlashCols(col)) return true;
        }
    }

    private checkBackSlashCols(col: number) {
        let rows = this.gameBoard.length - col;
        let redCount = 0;
        let blackCount = 0;
        for (let row = 0; row < rows; row++) {
            let piece = this.gameBoard[row][col + row]
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            } else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            } else {
                redCount = 0;
                blackCount = 0;
            }
        }
        return GameBoard.isFour(blackCount, redCount);
    }

    private checkBackSlashRows(row: number) {
        let cols = this.gameBoard.length - row;
        let redCount = 0;
        let blackCount = 0;
        for (let col = 0; col < cols; col++) {
            let piece = this.gameBoard[row + col][col];
            if (GameBoard.isRed(piece)) {
                redCount++;
                blackCount = 0;
            } else if (GameBoard.isBlack(piece)) {
                blackCount++;
                redCount = 0;
            } else {
                redCount = 0;
                blackCount = 0;
            }
        }
        return GameBoard.isFour(blackCount, redCount);
    }

    public toString() {
        return this.gameBoard.toString();
    }
}

module.exports = GameBoard;