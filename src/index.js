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
			squares: squares,
			stepNumber: 0,
			player: 'Rr',
			moveFrom: [-1,-1]
		};
	}

	handleClick(src) {
		console.log(src);
		console.log(this.state.moveFrom);
		console.log("State");
		console.log(this.state);
		const moveFrom = this.state.moveFrom.slice();
		const squares = this.state.squares.slice();
		if(JSON.stringify(moveFrom) === JSON.stringify([-1,-1])) {
			console.log("move from = -1");
			console.log(this.state.player);
			console.log(squares[src[0]][src[1]]);
			if(!this.state.player.includes(squares[src[0]][src[1]]))
				return; //todo: add error message
			console.log("selected correct player");
			this.setState((state) => {
				return {moveFrom: src.slice()}
			});
			console.log("State after changing move from, about to call showValidMoves");
			console.log(this.state);
			this.showValidMoves(src);
		}
		else {
			console.log("State before changing moveFrom back");
			console.log(this.state);
			console.log("About to compare moveFrom and src");
			console.log(this.state.moveFrom);
			console.log(src);
			if(JSON.stringify(moveFrom) === JSON.stringify(src)) {
				this.setState((state) => {
					return {moveFrom: [-1,-1]}
				});
				this.clearHighlights();
				return;
			}
			//todo:do second half of move
		}
		return;
	}
	clearHighlights() {
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		for(var row of squares) {
			for(var index = 0; index < 8; index++) {
				if(row[index] === 'h') {
					row[index] = null;
				}
			}
		}
		console.log("cleared squares");
		console.log(squares);
		this.setState((state) => {
			return {squares: squares}
		});
	}
	showValidMoves(src) {
		let validMoves = [];
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		const dir = this.state.player === 'Rr' ? -1:1;
		console.log("dir: " + dir);
		if(src[0] + dir >= 0 && src[0] + dir < 8 && src[1] + 1 >= 0 && src[1] + 1 < 8) 
			if(!squares[src[0] + dir][src[1] + 1] ) {
				validMoves.push([src[0] + dir, src[1] + 1]);
			}
		if(src[0] + dir >= 0 && src[0] + dir < 8 && src[1] - 1 >= 0 && src[1] - 1 < 8) 
			if(!squares[src[0] + dir][src[1] - 1] ) {
				validMoves.push([src[0] + dir, src[1] - 1]);
			}
		validMoves.push(...this.showValidJumps(src, squares));
		for(var move of validMoves) {
			squares[move[0]][move[1]] = 'h';
		}
		this.setState((state) => {
			return {squares: squares}
		});
		console.log(squares);
	}
	showValidJumps(src, squares) {
		let validJumps = [];
		const dir = this.state.player === 'Rr' ? -1:1;
		const enemy = this.state.player === 'Rr' ? 'Br':'Rr';
		if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {
			if(squares[src[0] + dir][src[1] + 1] === enemy && !squares[src[0] + (2*dir)][src[1] + 2]) {
				validJumps.push([src[0] + (2*dir), src[1] + 2]);
				squares[src[0] + dir][src[1] + 1] = null;
				validJumps.push(...this.validJumps([src[0] + (2*dir), src[1] + 2], squares));
				}
		}
		if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {
			if(squares[src[0] + dir][src[1] - 1] === enemy && !squares[src[0] + (2*dir)][src[1] - 2]) {
				validJumps.push([src[0] + (2*dir), src[1] - 2]);
				squares[src[0] + dir][src[1] - 1] = null;
				validJumps.push(...this.validJumps([src[0] + (2*dir), src[1] - 2], squares));
				}
		}
		return validJumps;		
	}
	render() {
	const squares = this.state.squares.slice();
		return (
			<div className="game">
				<h2>Checkers</h2>
				<Board 
					squares={squares}
					onClick={(src) => this.handleClick(src)}
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
	renderRow(i) {
		return (
			<div className="row"> 
				<Square
					value={this.props.squares[i][0]}
					onClick={() => this.props.onClick([i,0])}
				/>
				<Square
					value={this.props.squares[i][1]}
					onClick={() => this.props.onClick([i,1])}
				/>
				<Square
					value={this.props.squares[i][2]}
					onClick={() => this.props.onClick([i,2])}
				/>
				<Square
					value={this.props.squares[i][3]}
					onClick={() => this.props.onClick([i,3])}
				/>
				<Square
					value={this.props.squares[i][4]}
					onClick={() => this.props.onClick([i,4])}
				/>
				<Square
					value={this.props.squares[i][5]}
					onClick={() => this.props.onClick([i,5])}
				/>
				<Square
					value={this.props.squares[i][6]}
					onClick={() => this.props.onClick([i,6])}
				/>
				<Square
					value={this.props.squares[i][7]}
					onClick={() => this.props.onClick([i,7])}
				/>
			</div>
			);
				}

	render() {
		console.log("Board");
		console.log(this.props.squares);
		//let arrSquares = Array.from(this.state.squares.squares);
		//console.log(arrSquares);
		return (
			<div className="board">
				{this.renderRow(0)}
				{this.renderRow(1)}
				{this.renderRow(2)}
				{this.renderRow(3)}
				{this.renderRow(4)}
				{this.renderRow(5)}
				{this.renderRow(6)}
				{this.renderRow(7)}
			</div>
		);
	}
}

function Square(props) {
	if(props.value === 'h') {
		return (
			<div className="selectedSquare" onClick={props.onClick}>
				<p></p>
			</div>
		);
	}
	return (
		<div className="square" onClick={props.onClick}>
			<p>{props.value}</p>
		</div>
	);
}


// ===================

ReactDOM.render(
	<Game />,
	document.getElementById("root")
);

/*function calculateWinner(squares) {

}*/
