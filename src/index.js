import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
	constructor(props) {
		super(props);
		let squares = [];
		squares.push(["b",null,"b",null,"b",null,"b",null]);
		squares.push([null,"b",null,"b",null,null,null,"b"]);
		squares.push(["b",null,"b",null,"r",null,"b",null]);

		squares.push([null, null, null, null, null, null, null, null]);
		squares.push([null, null, "r", null, null, null, null, null]);
		
		squares.push([null,null,null,"r",null,"r",null,"r"]);
		squares.push(["r",null,"r",null,"r",null,"r",null]);
		squares.push([null,null,null,"B",null,"r",null,"r"]);

		this.state= {
			squares: squares,
			stepNumber: 0,
			player: 'Rr',
			moveFrom: [-1,-1]
		};
	}

	handleClick(src) {
		const moveFrom = this.state.moveFrom.slice();
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		if(JSON.stringify(moveFrom) === JSON.stringify([-1,-1])) {
			if(!this.state.player.includes(squares[src[0]][src[1]]))
				return; //todo: add error message
			console.log("selected correct player");
			this.setState((state) => {
				return {moveFrom: src.slice()}
			},function(){ return this.showValidMoves(src); });
		}
		else {
			if(JSON.stringify(moveFrom) === JSON.stringify(src)) {
				this.setState((state) => {
					return {moveFrom: [-1,-1]}
				});
				this.clearHighlights();
				return;
			}
			if(squares[src[0]][src[1]] !== 'h') {
				//todo: add error message, invalid move
				return;
			}
			else {
				this.executeMove(moveFrom, src);
			}
		}
		return;
	}
	clearHighlights() {
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		console.log("clearing highlights");
		for(var row of squares) {
			for(var index = 0; index < 8; index++) {
				if(row[index] === 'h') {
					row[index] = null;
				}
			}
		}
		this.setState((state) => {
			return {squares: squares}
		});
	}
	showValidMoves(src) {
		console.log(src);
		let validMoves = [];
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		const dir = this.state.player === 'Rr' ? -1:1;
		//Forward - Right check
		if(src[0] + dir >= 0 && src[0] + dir < 8 && src[1] + 1 >= 0 && src[1] + 1 < 8) 
			if(!squares[src[0] + dir][src[1] + 1] ) {
				validMoves.push([src[0] + dir, src[1] + 1]);
			}
		//Forward - Left check
		if(src[0] + dir >= 0 && src[0] + dir < 8 && src[1] - 1 >= 0 && src[1] - 1 < 8) 
			if(!squares[src[0] + dir][src[1] - 1] ) {
				validMoves.push([src[0] + dir, src[1] - 1]);
			}
		//Backwards Checks
		if("RB".includes(squares[src[0]][src[1]])) {
			//Backward - Right check
			if(src[0] - dir >= 0 && src[0] - dir < 8 && src[1] + 1 >= 0 && src[1] + 1 < 8) {
				if(!squares[src[0] - dir][src[1] + 1] ) {
					validMoves.push([src[0] - dir, src[1] + 1]);
				}
			}
			//Backward - Left check
			if(src[0] - dir >= 0 && src[0] - dir < 8 && src[1] - 1 >= 0 && src[1] - 1 < 8) 
				if(!squares[src[0] - dir][src[1] - 1] ) {
					validMoves.push([src[0] - dir, src[1] - 1]);
				}
		}
		validMoves.push(...this.showValidJumps(src, squares));
		for(var move of validMoves) {
			squares[move[0]][move[1]] = 'h';
		}
		this.setState((state) => {
			return {squares: squares}
		});
	}
	showValidJumps(src, squaresRef) {
		console.log("show valid moves, src: ");
		console.log(src);
		console.log(squaresRef);
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(squaresRef[index].slice());
		}
		let validJumps = [];
		let dir = this.state.player === 'Rr' ? -1:1;
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] + dir][src[1] + 1])  && squares[src[0] + (2*dir)][src[1] + 2] === null) {	//check that square between the jump is an enemy piece, and dst in null
				console.log("right is valid");
				validJumps.push([src[0] + (2*dir), src[1] + 2]);
				squares[src[0] + dir][src[1] + 1] = null;
				validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] + 2], squares));
				}
		}
		if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that left jump is within the board
			if(enemy.includes(squares[src[0] + dir][src[1] - 1]) && squares[src[0] + (2*dir)][src[1] - 2] === null) {	//check that square between the jump is an enemy piece, and dst is null
				console.log("left is valid");
				validJumps.push([src[0] + (2*dir), src[1] - 2]);
				squares[src[0] + dir][src[1] - 1] = null;
				validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] - 2], squares));
				}
		}
		//backwards checks
		if("RB".includes(squares[this.state.moveFrom[0]][this.state.moveFrom[1]])) {
			console.log("checking king jumps");
			dir = dir * -1;
			if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
				if(enemy.includes(squares[src[0] + dir][src[1] + 1])  && squares[src[0] + (2*dir)][src[1] + 2] === null) {
					console.log("backwards right is valid");
					validJumps.push([src[0] + (2*dir), src[1] + 2]);
					squares[src[0] + dir][src[1] + 1] = null;
					validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] + 2], squares));
					}
			}
			if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that left jump is within the board
				console.log("looking backwards left");
				if(enemy.includes(squares[src[0] + dir][src[1] - 1]) && squares[src[0] + (2*dir)][src[1] - 2] === null) {	
					console.log("backwards left is valid");
					validJumps.push([src[0] + (2*dir), src[1] - 2]);
					squares[src[0] + dir][src[1] - 1] = null;
					validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] - 2], squares));
					}
			}
		}

		return validJumps;		
	}
	executeMove(src, dst) {
		//this.clearHighlights();
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		const step = this.state.stepNumber + 1;
		if(Math.abs(src[0] - dst[0]) === 1 && Math.abs(src[1] - dst[1]) === 1) {
			squares[dst[0]][dst[1]] = squares[src[0]][src[1]];
			squares[src[0]][src[1]] = null;
		}
		else {
			let route = this.getRoute(src, dst, squares);
			//iterate through path and remove the pieces in route
			for(let i = 0; i < route.length-1; i++) {
				squares[(route[i][0]+route[i+1][0])/2][(route[i][1]+route[i+1][1])/2] = null;
			}
			squares[dst[0]][dst[1]] = squares[src[0]][src[1]];
			squares[src[0]][src[1]] = null;
		}
		const kingRow = this.state.player === 'Rr' ? 0 : 7;
		if(dst[0] === kingRow) {
			squares[dst[0]][dst[1]] = squares[dst[0]][dst[1]].toUpperCase();
		}
		console.log("about to move piece");
		console.log(squares);
		this.setState((state) => {
			return {squares: squares,
				player: enemy,
				stepNumber: step,
				moveFrom: [-1, -1]
				}
		},this.clearHighlights);
	}
	getRoute(src, dst, squaresRef) {
		let squares = [];
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		for(let index = 0; index < 8; index++) {
			squares.push(squaresRef[index].slice());
		}
		let route = [];
		
		//check forward - left
		if(src[0] + 2 >= 0 && src[0] + 2 < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] + 1][src[1] - 1])  && squares[src[0] + 2][src[1] - 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				route = [];
				route.push(src);
				route.push([src[0] + 2, src[1] - 2]);
				squares[src[0]+2][src[1]-2] = squares[src[0]][src[1]];
				squares[src[0]][src[1]] = null;
				squares[src[0]+1][src[1]-1] = null;
				if(src[0] + 2 === dst[0] && src[1] - 2 === dst[1])
					return route;
				else
					route.push(...this.getRoute([src[0] + 2,src[1] - 2], dst, squares));
			}
		}
		
		//check forward right
		if(src[0] + 2 >= 0 && src[0] + 2 < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {
			if(enemy.includes(squares[src[0] + 1][src[1] + 1])  && squares[src[0] + 2][src[1] + 2] === 'h') {
				route = [];
				route.push(src);
				route.push([src[0] + 2, src[1] + 2]);
				squares[src[0]+2][src[1]+2] = squares[src[0]][src[1]];
				squares[src[0]][src[1]] = null;
				squares[src[0]+1][src[1]+1] = null;
				if(src[0] + 2 === dst[0] && src[1] + 2 === dst[1])
					return route;
				else
					route.push(...this.getRoute([src[0] + 2,src[1] + 2], dst, squares));
			}
		}
		//check back left
		if(src[0] - 2 >= 0 && src[0] - 2 < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] - 1][src[1] - 1])  && squares[src[0] - 2][src[1] - 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				route = [];
				route.push(src);
				route.push([src[0] - 2, src[1] - 2]);
				squares[src[0]-2][src[1]-2] = squares[src[0]][src[1]];
				squares[src[0]][src[1]] = null;
				squares[src[0]-1][src[1]-1] = null;
				if(src[0] - 2 === dst[0] && src[1] - 2 === dst[1])
					return route;
				else
					route.push(...this.getRoute([src[0] - 2,src[1] - 2], dst, squares));
			}
		}
		//check back right
		if(src[0] - 2 >= 0 && src[0] - 2 < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] - 1][src[1] + 1])  && squares[src[0] - 2][src[1] + 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				route = [];
				route.push(src);
				route.push([src[0] - 2, src[1] + 2]);
				squares[src[0]-2][src[1]+2] = squares[src[0]][src[1]];
				squares[src[0]][src[1]] = null;
				squares[src[0]-1][src[1]+1] = null;
				if(src[0] - 2 === dst[0] && src[1] + 2 === dst[1])
					return route;
				else
					route.push(...this.getRoute([src[0] - 2,src[1] + 2], dst, squares));
			}
		}
		return route;
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
				<div className="stats">
					<p>Player: {this.state.player}</p>
					<p>MoveNumber: {this.state.stepNumber}</p>
				</div>
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
