import React, { Component } from 'react'
import Board from './Board'
import Dropdown from 'react-bootstrap/Dropdown' 
import DropdownButton from 'react-bootstrap/DropdownButton'

/* Parent Component */

class Minesweeper extends Component {

    constructor(props) {
        super(props)

        this.state = {
            rows: 0,
            cols: 0,
            mines: 0,
            flags: 0,
            time: 0,
            start: 0
        }

        this.boardElement = React.createRef();
        this.decrement = this.decrement.bind(this);
        this.increment = this.increment.bind(this);
        this.changeDifficulty = this.changeDifficulty.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.resetFlags = this.resetFlags.bind(this);
    }

    /* Checks screen size before game begins, to show correct formatting per device */
    componentWillMount() {

        console.log("checking screen...");
        
        let r, c, m, f = 0;

        if(window.screen.width <= 768) {
                
            console.log("mobile...");
            r = 11;
            c = 7;
            m = 10;
            f = 10;

        } else {
            
            r = 8;
            c = 10;
            m = 10;
            f = 10;

        }

        this.setState(() => ({
            rows: r,
            cols: c,
            mines: m,
            flags: f
        }))
    }

    /* Handles decrementing flag count */
    decrement() {

        console.log("in decrement...");

        let f = this.state.flags - 1;

        this.setState((prevState, props) => ({
            flags: f
        }))
    }

    /* Handles incrementing flag count */
    increment() {

        console.log("in increment...");

        let f = this.state.flags + 1;

        this.setState((prevState, props) => ({
            flags: f
        }))
    }
    
    /* Changes row, col, mine and flag values based on difficulty selected */
    changeDifficulty(difficulty) {

        let r, c, m, f = 0

        if(difficulty === "easy") {

            if(window.screen.width <= 768) {
                
                r = 11;
                c = 7;
                m = 10;
                f = 10;

            } else {
                
                r = 8;
                c = 10;
                m = 10;
                f = 10;

            }
            
            this.setState((prevState, props) => ({
                rows: r,
                cols: c,
                mines: m,
                flags: f
            }))
        }

        if(difficulty === "medium") {

            if(window.screen.width <= 768) {
                
                r = 18;
                c = 11;
                m = 40;
                f = 40;

            } else {
                
                r = 14;
                c = 18;
                m = 40;
                f = 40;

            }
                
            this.setState((prevState, props) => ({
                rows: r,
                cols: c,
                mines: m,
                flags: f
            }))
        }

        /* Calls child changeDifficulty function to change childs state accordingly */
        this.boardElement.current.changeDifficulty(r, c);
    }

    /* Starts the timer */
    startTimer() {
    
        this.setState({
            start: Date.now()
        });

        this.timer = setInterval( () => this.setState ({
            time: Date.now() - this.state.start
        }), 1000)
    }

    /* Stops the timer */
    stopTimer() {

        /* setInterval gets called twice for some reason, so clear both intervals */
        clearInterval(this.timer - 1);
        clearInterval(this.timer);
    }

    /* Reset the timer to zero */
    resetTimer() {
        this.setState({
            time: 0,
            start: Date.now()
        });
    }
    
    /* Set flag count back to  */
    resetFlags() {
        this.setState({
            flags: this.state.mines
        });
    }

    /* Renders the game board using a table */
    render() {

        let { rows, cols, mines, flags, time } = this.state;
        return (
            <div className="the-game">
                <table>            
                    <thead>
                        <tr>
                            <th colSpan={cols}>
                                <div className="col">Flags: {flags}</div>
                                <div className="col">Timer: {Math.floor(time / 1000)}</div>
                                <div className="col">
                                    <DropdownButton id="dropdown-basic-button" title="Difficulty">
                                        <Dropdown.Item eventKey="easy" onSelect={this.changeDifficulty}>Easy</Dropdown.Item>
                                        <Dropdown.Item eventKey="medium" onSelect={this.changeDifficulty}>Medium</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        <Board 
                            ref={this.boardElement}
                            rows={rows} 
                            cols={cols} 
                            mines={mines}
                            decrement={this.decrement}
                            increment={this.increment}
                            startTimer={this.startTimer}
                            stopTimer={this.stopTimer}
                            resetTimer={this.resetTimer}
                            resetFlags={this.resetFlags}
                        />
                    </tbody>
                    
                </table>
            </div>
        )
    }
}

export default Minesweeper
