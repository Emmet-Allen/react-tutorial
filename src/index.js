import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Child component of 'Board' 
//class Square extends React.Component { //Creates a react components class, takes in parameters called 'props'
//    constructor(props) {
//        super(props); //Always need 'super()' when defining the constructor of a subclass, in React this is 'super(props)'
//        this.state = { //'this.state' used for components to remember input, set within the components constructor (private)
//            value: null,
//        };
//    }

//    render() { //render is a method that returns a description of what you want to see on the screen
//        return (
// //'onClick' gives tag element a certain functionality through a passed in function. This gives buttons the ability for user to click and output a response
//            <button
//                className="square"
//                onClick={() => this.props.onClick()}
//                //onClick tells React to setup a click event listener, when button is clicked event handler will call onClick handler prop specified on board
//            >
//                {this.props.value}
//            </button>
//        );
//    }
//}

// Function Component 'Square', Child Component of 'Board': Function Components are useful for single input rendering
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}


class Title extends React.Component {
    render() {
        return (
            <h1>
                {'Tic Tac Toe'}
            </h1>
        );
    }
}

//Parent component of 'Sqaure', Best practice to store the game's state in Parent rather than Child. Can tell the state of each square by passing a prop
class Board extends React.Component { 
    //constructor(props) {
    //    super(props);
    //    this.state = {
    //        squares: Array(9).fill(null),
    //        xIsNext: true,
    //    };
    //}

    //handleClick(i) { 
    //    const squares = this.state.squares.slice(); //'slice' each state of squares in array IMMUTABLE: Makes copy of data to be manipulated without effecting global code
    //    if (calculateWinner(squares) || squares[i]) {
    //        return; 
    //    }
    //    squares[i] = this.state.xIsNext ? 'X' : 'O'; //replaces 'slice' square array postion with boolean 'X' : '0'
    //    this.setState({
    //        squares: squares,
    //        xIsNext: !this.state.xIsNext, //Sets state of xIsNext if NOT...
    //    });
    //}

    renderSquare(i) {
        //return <Square value={this.state.squares[i]}
            //onClick={() => this.handleClick(i)}/>; //Square calls 'this.handleClick()' when clicked
       
        return (
            <Square
                value={this.props.squares[i]} //Square calls 'this.props.squares[i]' when clicked
            onClick={() => this.props.onClick(i)}//Event onClick listener to this.props.onClick[i]
        />
       );
    }


    render() {
        //const winner = calculateWinner(this.state.squares);
        //let status;
        //if (winner) {
        //    status = "Winner : " + winner;
        //} else {
        //    status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');  //Display 'X' : 'O' depending if state is not XisNext (defined in handleClick)
        //}

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );

     
        
    }
}

class Game extends React.Component {
    constructor(props) { //"Lifting State Up" of board to game, in order to access game history (Time travel) 
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0, //Reflects move displayed
            xIsNext: true,
        };
    }

    //"Lifted Up" from 'Board' to 'Game' 
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); //Incraments Step Number by 1
        const current = history[history.length - 1];
        const squares = current.squares.slice(); //'slice' each state of squares in array IMMUTABLE: Makes copy of data to be manipulated without effecting global code
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; //replaces 'slice' square array postion with boolean 'X' : '0'
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext, //Sets state of xIsNext if NOT...
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0, //If step number % 2 is 0, then xIsNext is true 
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => { //'maps' over the history array and for each step and move parameter
            const desc = move ?
                "Go To Move #" + move : //Displays with move number (via history array)
                "Reset"; //Displays Reset (goes back to 'null' value of history array)
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}> 
                        {desc}
                    </button>
                </li>
                      ); //Will go to certain # in history array using 'key' reserved property. 'key' property is extracted and returned directly on element. 
                    });

                    let status;
        if (winner) {
            status = "Winner : " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');  //Display 'X' : 'O' depending if state is not XisNext (defined in handleClick)
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] == squares[b] && squares[a] == squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

