import React, { Component } from 'react'
import Tile from './Tile'

/* Child Component */
class Board extends Component {

    constructor(props) {
        super(props)

        this.state = {
            theBoard: this.initTempBoard(this.props.rows, this.props.cols),
            gameStarted: false
        }

        this.tileLeftClickedHandler = this.tileLeftClickedHandler.bind(this);
        this.tileRightClickedHandler = this.tileRightClickedHandler.bind(this);
        this.longClickPress = this.longClickPress.bind(this);
        this.longClickRelease = this.longClickRelease.bind(this);
    }

    /* Resets the board after a win/loss, evokes parent functions to reset counters */
    resetBoard(rows, cols) {
       
        console.log("resetting...");

        this.props.stopTimer();
        this.props.resetTimer();
        this.props.resetFlags();

        this.setState(() => ({
            theBoard: this.initTempBoard(rows, cols),
            gameStarted: false
        }))
    }

    /* Changes state of the Board (i.e. rows, cols, etc) based on changed parent state */
    changeDifficulty(rows, cols) {
        
        this.setState(() => ({
            theBoard: this.initTempBoard(rows, cols),
            gameStarted: false
        }))

        this.props.stopTimer();
        this.props.resetTimer();
    }

    /* Creates an empty array with dimensions of the board */
    createEmptyBoard(rows, cols) {

        let theBoard = [];

        for (let i = 0; i < rows; i++) {

            theBoard.push([]);

            for (let j = 0; j < cols; j++) {

                theBoard[i][j] = {
                    row: i,
                    col: j,
                    mine: false,
                    mineCount: 0,
                    revealed: false,
                    flag: false
                };

            }
        }

        return theBoard;
    }

    /* Returns a random integer */
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /* Checks all surrounding tiles to the initial clicked tile */
    checkProximity(row, col, theRow, theCol) {

        /* mine cant be on this tile */
        if (row === theRow && col === theCol) {
            return false;
        }

        /* mine cant be above this tile */
        if (row === theRow - 1 && col === theCol) {
            return false;
        }

        /* mine cant be below this tile */
        if (row === theRow + 1 && col === theCol) {
            return false;
        }

        /* mine cant be left of this tile */
        if (row === theRow && col === theCol - 1) {
            return false;
        }

        /* mine cant be right of this tile */
        if (row === theRow && col === theCol + 1) {
            return false;
        }

        /* mine cant be above and to the left of this tile */
        if (row === theRow - 1 && col === theCol - 1) {
            return false;
        }

        /* mine cant be above and to the right of this tile */
        if (row === theRow - 1 && col === theCol + 1) {
            return false;
        }

        /* mine cant be below and to the left of this tile */
        if (row === theRow + 1 && col === theCol - 1) {
            return false;
        }

        /* mine cant be below and to the right of this tile */
        if (row === theRow + 1 && col === theCol + 1) {
            return false;
        }

        return true;
    }

    /* Places mines around the board, won't place mine on, or around intial tile clicked */
    placeMines(theBoard, theRow, theCol) {

        let { rows, cols, mines } = this.props;
        let r, c, m = 0;

        while (m < mines) {

            while (true) {

                r = this.getRandomInt(rows);
                c = this.getRandomInt(cols);

                /* make sure random x isnt intial click xpos */
                if (this.checkProximity(r, c, theRow, theCol)) {
                    break;
                }
            }

            if (!(theBoard[r][c].mine)) {
                theBoard[r][c].mine = true;
                m++;
            }

        }

        return theBoard;
    }

    /* Gets all the valid tiles surrounding a source tile */
    checkSurroundingArea(theRow, theCol, theBoard) {

        let temp = [];
        let { rows, cols } = this.props;

        /* up */
        if (theRow > 0) {
            temp.push(theBoard[theRow - 1][theCol]);
        }

        /* down */
        if (theRow < rows - 1) {
            temp.push(theBoard[theRow + 1][theCol]);
        }

        /* left */
        if (theCol > 0) {
            temp.push(theBoard[theRow][theCol - 1]);
        }

        /* right */
        if (theCol < cols - 1) {
            temp.push(theBoard[theRow][theCol + 1]);
        }

        /* up left */
        if (theRow > 0 && theCol > 0) {
            temp.push(theBoard[theRow - 1][theCol - 1]);
        }

        /* up right */
        if (theRow > 0 && theCol < cols - 1) {
            temp.push(theBoard[theRow - 1][theCol + 1]);
        }

        /* down left */
        if (theRow < rows - 1 && theCol > 0) {
            temp.push(theBoard[theRow + 1][theCol - 1]);
        }

        /* down right */
        if (theRow < rows - 1 && theCol < cols - 1) {
            temp.push(theBoard[theRow + 1][theCol + 1]);
        }

        return temp;
    }

    /* Finds all mines surrounding a tile */
    findMines(theBoard) {

        let temp = theBoard;
        let { rows, cols } = this.props;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                if (!(theBoard[i][j].mine)) {
                    let numMines = 0;

                    /* Get all surrounding tiles to this tile */
                    let surround = this.checkSurroundingArea(i, j, temp);

                    /* Check if any of the surrounding tiles are mines, and update minecount if so */
                    surround.map(tile => {
                        
                        if (tile.mine) {
                            numMines++;
                        }

                    });

                    temp[i][j].mineCount = numMines;
                }
                
            }
        }

        return temp;
    }

    /* Gets a count of all revealed tiles to check win condition */
    findRevealedTiles(theBoard) {

        let {rows, cols} = this.props;
        let revealed = 0;    

        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                if(theBoard[i][j].revealed) {
                    revealed += 1;
                }
            }
        }

        return revealed;
    }

    /* Recursively uncovers all empty tiles */
    uncoverEmptyTiles(theRow, theCol, theBoard) {

        /* gets all surrounding tiles to tile at [xpos][ypos] */

        let surround = this.checkSurroundingArea(theRow, theCol, theBoard);

        surround.map(tile => {

            /* Check if this tile isn't revealed, flagged or a mine and is empty */
            if (!tile.mine && !tile.revealed && !tile.flag) {

                theBoard[tile.row][tile.col].revealed = true;

                /* since this tile is empty, check recursively all around this tile too */
                if (tile.mineCount === 0) {

                    this.uncoverEmptyTiles(tile.row, tile.col, theBoard);

                }
            }

        });

        return theBoard;
    }

    longClickPress(theRow, theCol) {
        this.longClickTimer = setTimeout(() => {
            this.tileRightClickedHandler(theRow, theCol);
        }, 1000);
    }

    longClickRelease() {
        clearTimeout(this.longClickTimer);
    }

    /* Handles flag functionality */
    tileRightClickedHandler(theRow, theCol) {

        let {theBoard} = this.state;

        let temp = theBoard;

        /* if the tile is revealed already, do nothing */
        if (temp[theRow][theCol].revealed) {
            return null;
        }

        /* if the tile is flagged, unflag it, else flag it */
        if (temp[theRow][theCol].flag) {

            /* Call parent increment function */
            this.props.increment();
            temp[theRow][theCol].flag = false;

        } else {

            /* Call parent decrement function */
            this.props.decrement();
            temp[theRow][theCol].flag = true;

        }

        this.setState(() => ({
            theBoard: temp
        }))
    }

    revealMines(rows, cols) {

        let {theBoard} = this.state;

        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {

                if(theBoard[i][j].mine) {
                    theBoard[i][j].revealed = true;
                }

            }
        }

        this.setState(() => ({
            theBoard: theBoard
        }))
    }

    /* Handles tile click functionality */
    tileLeftClickedHandler(theRow, theCol) {

        let { rows, cols, mines } = this.props;
        let { gameStarted, theBoard } = this.state;

        /* Get count of revealed tiles */
        let revealed = this.findRevealedTiles(theBoard);
        let safeTiles = (rows * cols) - mines;

        let temp = theBoard;

        /* If condition is true, player has won, resets game */
        if(revealed === safeTiles - 1) {
           
            alert("You Win!");
            this.resetBoard(rows, cols);
            return null;

        }

        /* game has not been started, start game */
        if (!gameStarted) {

            this.setState(() => ({
                theBoard: this.initRealBoard(theRow, theCol, rows, cols),
                gameStarted: true
            }))

        } else {

            console.log(`Row: ${theRow}, Col: ${theCol}, Revealed: ${temp[theRow][theCol].revealed}, Flag: ${temp[theRow][theCol].flag}, Mine: ${temp[theRow][theCol].mine}, Mine Count: ${temp[theRow][theCol].mineCount}`);

            /* if game started uncover tile */

            /* if the tile is revealed already, do nothing */
            if (temp[theRow][theCol].revealed) {
                return null;
            }

            /* if the tile is flagged, do nothing */
            if (temp[theRow][theCol].flag) {
                return null;
            }

            /* if the tile is a mine, player loses, resets game */
            if (temp[theRow][theCol].mine) {
            
                alert("You Lost...");
                this.resetBoard(rows, cols);
                return null;

            }
                
            /* if the tile has no surrounding mines, uncover all surrounding empty tiles recursively */
            if (temp[theRow][theCol].mineCount === 0) {

                temp[theRow][theCol].revealed = true;
                temp = this.uncoverEmptyTiles(theRow, theCol, temp);

            } else {

                /* else the tile has a surrounding mine, reveal this tile */
                temp[theRow][theCol].revealed = true;

            }

            this.setState(() => ({
                theBoard: temp,
            }))
        }
    }


    /* Initializes an empty board with no mines, this is for the initial click, prevents default right click functionality */
    initTempBoard(rows, cols) {
        
        let theBoard = this.createEmptyBoard(rows, cols);

        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        return theBoard;
    }

    /* After initial click, creates board and populates with all necessary data (i.e. mines, counts etc) */
    initRealBoard(xpos, ypos, rows, cols) {

        let theBoard = this.createEmptyBoard(rows, cols);
        theBoard = this.placeMines(theBoard, xpos, ypos)
        theBoard = this.findMines(theBoard);
        theBoard = this.uncoverEmptyTiles(xpos, ypos, theBoard);
        
        /* Start timer when game really begins */
        this.props.startTimer();

        return theBoard;
    }

    render() {
        return (
            /* Row of table */
            this.state.theBoard.map((tile, row) => {
                return (
                    <tr row={row}>
                        {tile.map((tile, col) => {
                            return (
                                /* Individual tile of table */
                                <Tile
                                    row={row}
                                    col={col}
                                    tile={tile}
                                    clickHandler={this.tileLeftClickedHandler}
                                    contextHandler={this.tileRightClickedHandler}
                                    onMouseDown={this.longClickPress}
                                    onMouseUp={this.longClickRelease}
                                />
                            );
                        })}
                    </tr>
                );
            })
        );
    }
}

export default Board