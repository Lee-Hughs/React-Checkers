import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
	constructor(props) {
		super(props);
		let squares = Array(64).fill(null);
		squares[1] = "r";
		squares[3] = "r";
		squares[5] = "r";
		squares[7] = "r";
		squares[8] = "r";
		squares[10] = "r";
		squares[12] = "r";
		squares[14] = "r";
		squares[17] = "r";
		squares[19] = "r";
		squares[21] = "r";
		squares[23] = "r";

		squares[62] = "b";
		squares[60] = "b";
		squares[58] = "b";
		squares[56] = "b";
		squares[55] = "b";
		squares[53] = "b";
		squares[51] = "b";
		squares[49] = "b";
		squares[46] = "b";
		squares[44] = "b";
		squares[42] = "b";
		squares[40] = "b";
		console.log("Game");
		console.log(squares);
		this.state= {
			history: [{
				squares: {squares},
			}],
			stepNumber: 0,
			player: 'Red',
			moveFrom: -1
		};
	}

	/*handleClick(i) {
		squares = this.state.history[this.state.stepNumber];
		if(this.state.moveFrom === -1) {
			if(this.state.player === 'Red') {
				if(squares[i] !== 'r' && squares[i] !== 'R')
					return;
				//todo:move red piece
			}
			if(this.state.player === 'Black') {
				if(squares[i] !== 'b' && squares[i] !== 'B')
					return;
				//todo:move black piece
			}
		}
		else {
			//todo:do second half of move
		}
		return;
	}
	findMoves(i) {

	}*/
	render() {
    	const history = this.state.history;
    	const current = history[this.state.stepNumber];
		return (
			<div className="game">
				<h2>Checkers</h2>
				<Board 
					squares={current.squares}
				/>
			</div>
		);
	}
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: props.squares
		};
	}
	render() {
		console.log("Board");
		console.log(this.state.squares);
		let arrSquares = Array.from(this.state.squares.squares);
		console.log(arrSquares);
		return (
			<div className="board">
				<Row 
					squares={this.state.squares.squares.slice(0,8)}
				/>
				<Row
					squares={this.state.squares.squares.slice(8,16)}
				/>
				<Row 
					squares={this.state.squares.squares.slice(16,24)}
				/>
				<Row 
					squares={this.state.squares.squares.slice(24,32)}
				/>
				<Row 
					squares={this.state.squares.squares.slice(32,40)}
				/>
				<Row 
					squares={this.state.squares.squares.slice(40,48)}
				/>
				<Row 
					squares={this.state.squares.squares.slice(48,56)}
				/>
				<Row 
					squares={this.state.squares.squares.slice(56,64)}
				/>
			</div>
		);
	}
}

class Row extends React.Component {
	render() {
		console.log("row");
		console.log(this.props.squares);
		return (
			<div className="row">
				<Square 
					value={this.props.squares[0]}
				/>
				<Square 
					value={this.props.squares[1]}
				/>
				<Square 
					value={this.props.squares[2]}
				/>
				<Square 
					value={this.props.squares[3]}
				/>
				<Square 
					value={this.props.squares[4]}
				/>
				<Square 
					value={this.props.squares[5]}
				/>
				<Square 
					value={this.props.squares[6]}
				/>
				<Square 
					value={this.props.squares[7]}
				/>
			</div>
		);
	}
}
class Square extends React.Component {
	render() {
		return (
			<div className="square">
				<p>{this.props.value}</p>
			</div>
		)
	}
}


// ===================

ReactDOM.render(
	<Game />,
	document.getElementById("root")
);

/*function calculateWinner(squares) {

}*/
