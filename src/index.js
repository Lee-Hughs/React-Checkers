import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
	constructor(props) {
		super(props);
		let squares = [];
		squares.push(["b",null,"b",null,"b",null,"b",null]);
		squares.push([null,"b",null,"b",null,"b",null,"b"]);
		squares.push(["b",null,"b",null,"b",null,"b",null]);

		squares.push([null, null, null, null, null, null, null, null]);
		squares.push([null, null, null, null, null, null, null, null]);
		
		squares.push([null,"r",null,"r",null,"r",null,"r"]);
		squares.push(["r",null,"r",null,"r",null,"r",null]);
		squares.push([null,"r",null,"r",null,"r",null,"r"]);

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
					squares={this.state.squares.squares[0]}
				/>
				<Row
					squares={this.state.squares.squares[1]}
				/>
				<Row 
					squares={this.state.squares.squares[2]}
				/>
				<Row 
					squares={this.state.squares.squares[3]}
				/>
				<Row 
					squares={this.state.squares.squares[4]}
				/>
				<Row 
					squares={this.state.squares.squares[5]}
				/>
				<Row 
					squares={this.state.squares.squares[6]}
				/>
				<Row 
					squares={this.state.squares.squares[7]}
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
