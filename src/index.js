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

		this.state= {
			squares: squares,
			stepNumber: 0,
			player: 'Rr',
			moveFrom: [-1,-1],
			winner: null
		};
	}
	getInitialState() {
		let squares = [];
		squares.push(["b",null,"b",null,"b",null,"b",null]);
		squares.push([null,"b",null,"b",null,"b",null,"b"]);
		squares.push(["b",null,"b",null,"b",null,"b",null]);

		squares.push([null, null, null, null, null, null, null, null]);
		squares.push([null, null, null, null, null, null, null, null]);
		
		squares.push([null,"r",null,"r",null,"r",null,"r"]);
		squares.push(["r",null,"r",null,"r",null,"r",null]);
		squares.push([null,"r",null,"r",null,"r",null,"r"]);

		return {
			squares: squares,
			stepNumber: 0,
			player: 'Rr',
			moveFrom: [-1,-1],
			winner: null
		};
	}

	handleClick(src) {
		let api_load = "[";
		for(let index = 0; index < 8; index++) {
			api_load += JSON.stringify(this.state.squares[index]).substring(1,JSON.stringify(this.state.squares[index]).length-1);
			api_load += ",";
		}
		api_load = api_load.substring(0,api_load.length-1);
		api_load += "]";

		if(this.state.winner || this.state.player === "Bb") {
			return
		}
		const moveFrom = this.state.moveFrom.slice();
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		if(JSON.stringify(moveFrom) === JSON.stringify([-1,-1])) {
			if(!this.state.player.includes(squares[src[0]][src[1]]))
				return; //todo: add error message
			this.setState((state) => {
				return {moveFrom: src.slice()}
			},function(){ return this.showValidMoves(src); });
		}
		else {
			if(JSON.stringify(moveFrom) === JSON.stringify(src)) {
				for(var row of squares) {
					for(var index = 0; index < 8; index++) {
						if(row[index] === 'h') {
							row[index] = null;
						}
					}
				}
				this.setState((state) => {
					return {squares: squares,
						moveFrom: [-1,-1]}
				});
				//this.clearHighlights();
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
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(squaresRef[index].slice());
		}
		let validJumps = [];
		let dir = this.state.player === 'Rr' ? -1:1;
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] + dir][src[1] + 1])  && squares[src[0] + (2*dir)][src[1] + 2] === null) {	//check that square between the jump is an enemy piece, and dst in null
				validJumps.push([src[0] + (2*dir), src[1] + 2]);
				squares[src[0] + dir][src[1] + 1] = null;
				validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] + 2], squares));
				}
		}
		if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that left jump is within the board
			if(enemy.includes(squares[src[0] + dir][src[1] - 1]) && squares[src[0] + (2*dir)][src[1] - 2] === null) {	//check that square between the jump is an enemy piece, and dst is null
				validJumps.push([src[0] + (2*dir), src[1] - 2]);
				squares[src[0] + dir][src[1] - 1] = null;
				validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] - 2], squares));
				}
		}
		//backwards checks
		if("RB".includes(squares[this.state.moveFrom[0]][this.state.moveFrom[1]])) {
			dir = dir * -1;
			if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
				if(enemy.includes(squares[src[0] + dir][src[1] + 1])  && squares[src[0] + (2*dir)][src[1] + 2] === null) {
					validJumps.push([src[0] + (2*dir), src[1] + 2]);
					squares[src[0] + dir][src[1] + 1] = null;
					validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] + 2], squares));
					}
			}
			if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that left jump is within the board
				if(enemy.includes(squares[src[0] + dir][src[1] - 1]) && squares[src[0] + (2*dir)][src[1] - 2] === null) {	
					validJumps.push([src[0] + (2*dir), src[1] - 2]);
					squares[src[0] + dir][src[1] - 1] = null;
					validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] - 2], squares));
					}
			}
		}

		return validJumps;		
	}
	test_function() {
		console.log(this.state.squares);
		let api_load = "[";
		for(let index = 0; index < 8; index++) {
			api_load += JSON.stringify(this.state.squares[index]).substring(1,JSON.stringify(this.state.squares[index]).length-1);
			api_load += ",";
		}
		api_load = api_load.substring(0,api_load.length-1);
		api_load += "]";
		fetch('/checkers_bot/?board=' + api_load + '&player=Bb')
		.then(res => res.json())
		.then((data) => {
			data = JSON.parse(data['express']);
			this.executeEnemyMove(data);
			console.log(data);
		})
        	.catch(console.log);
		//.then(res => console.log(res))
		//.catch(console.log);
	}
	executeMove(src, dst, callback = this.test_function.bind(this)) {
		//this.clearHighlights();
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		const player = this.state.player;
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
		for(var row of squares) {
			for(var index = 0; index < 8; index++) {
				if(row[index] === 'h') {
					row[index] = null;
				}
			}
		}
		this.calculateWinner(squares, player);
		this.setState((state) => {
			return {squares: squares,
				player: enemy,
				stepNumber: step,
				moveFrom: [-1, -1]
				}
		},this.test_function );
		//callback();
	}
	executeEnemyMove(move) {
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		const enemy = 'Rr'
		const player = 'Bb'
		const step = this.state.stepNumber + 1;
		if(Math.abs(move[0][0] - move[move.length-1][0]) === 1 && Math.abs(move[0][1] - move[move.length-1][1]) === 1) {
			squares[move[move.length-1][0]][move[move.length-1][1]] = squares[move[0][0]][move[0][1]];
			squares[move[0][0]][move[0][1]] = null;
		}
		else {
			//iterate through path and remove the pieces in route
			for(let i = 0; i < move.length-1; i++) {
				squares[(move[i][0]+move[i+1][0])/2][(move[i][1]+move[i+1][1])/2] = null;
			}
			squares[move[move.length-1][0]][move[move.length-1][1]] = squares[move[0][0]][move[0][1]];
			squares[move[0][0]][move[0][1]] = null;
		}
		const kingRow = this.state.player === 'Rr' ? 0 : 7;
		if(move[move.length-1][0] === kingRow) {
			squares[move[move.length-1][0]][move[move.length-1][1]] = squares[move[move.length-1][0]][move[move.length-1][1]].toUpperCase();
		}
		this.calculateWinner(squares, player);
		this.setState((state) => {
			return {squares: squares,
				player: 'Rr',
				stepNumber: step,
				moveFrom: [-1, -1]
				}
		});

	}
	getRoute(src, dst, squaresRef) {
		let moveTree = new MoveTree(src);
		this.getRouteHelper(src, 0, squaresRef, moveTree);
		let route = [];
		for(let i = moveTree.moves.length-1; i > 0;) {
			if(route.length > 0 || JSON.stringify(moveTree.moves[i]) === JSON.stringify(dst) ) {
				route.push(moveTree.moves[i]);
				i = Math.floor((i-1)/4);
			}
			else {
				i--;
			}
		}
		route.push(src);
		route = route.reverse();
		return route;
	}
	getRouteHelper(src, srcIndex, squaresRef, tree) {
		let squares = [];
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		for(let index = 0; index < 8; index++) {
			squares.push(squaresRef[index].slice());
		}
		//look left forward
		if(src[0] + 2 >= 0 && src[0] + 2 < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] + 1][src[1] - 1])  && squares[src[0] + 2][src[1] - 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				tree.moves[srcIndex * 4 + 1] = [src[0] + 2, src[1] - 2];
				squares[src[0]+1][src[1]-1] = null;
				this.getRouteHelper([src[0]+2,src[1]-2], srcIndex*4+1,squares,tree);
			}
		}
		//look right forward
		if(src[0] + 2 >= 0 && src[0] + 2 < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] + 1][src[1] + 1])  && squares[src[0] + 2][src[1] + 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				tree.moves[srcIndex * 4 + 2] = [src[0] + 2, src[1] + 2];
				squares[src[0]+1][src[1]+1] = null;
				this.getRouteHelper([src[0]+2,src[1]+2], srcIndex*4+2,squares,tree);
			}
		}
		//look left back
		if(src[0] - 2 >= 0 && src[0] - 2 < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] - 1][src[1] - 1])  && squares[src[0] - 2][src[1] - 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				tree.moves[srcIndex * 4 + 3] = [src[0] - 2, src[1] - 2];
				squares[src[0]-1][src[1]-1] = null;
				this.getRouteHelper([src[0]-2,src[1]-2], srcIndex*4+3,squares,tree);
			}
		}
		//look right back
		if(src[0] - 2 >= 0 && src[0] - 2 < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] - 1][src[1] + 1])  && squares[src[0] - 2][src[1] + 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				tree.moves[srcIndex * 4 + 4] = [src[0] - 2, src[1] + 2];
				squares[src[0]-1][src[1]+1] = null;
				this.getRouteHelper([src[0]-2,src[1]+2], srcIndex*4+4,squares,tree);
			}
		}
	}
	calculateWinner(squaresRef, player) {
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(squaresRef[index].slice());
		}
		for(var row of squares) {
			for(var index = 0; index < 8; index++) {
				if(row[index] === 'h') {
					row[index] = null;
				}
			}
		}
		const enemy = player === "Rr" ? "Bb" : "Rr";
		const dir = this.state.player === 'Rr' ? 1:-1;
		let enemySquares = [];
		for(let i = 0; i < 8; i++) {
			for(let j = 0; j < 8; j++) {
				if(enemy.includes(squares[i][j])) {
					enemySquares.push([i,j]);
				}
			}
		}
		//if the enemy has no pieces left
		if(enemySquares.length === 0) {
			this.setState((state) => {
				return {winner: player}
			});
			return;
		}
		for(let i = 0; i < enemySquares.length; i++) {
			//Forward - Right check
			if(enemySquares[i][0] + dir >= 0 && enemySquares[i][0] + dir < 8 && enemySquares[i][1] + 1 >= 0 && enemySquares[i][1] + 1 < 8) {
				if(!squares[enemySquares[i][0] + dir][enemySquares[i][1] + 1] ) {
					return;
				}
			}
			//Forward - Left check
			if(enemySquares[i][0] + dir >= 0 && enemySquares[i][0] + dir < 8 && enemySquares[i][1] - 1 >= 0 && enemySquares[i][1] - 1 < 8) {
				if(!squares[enemySquares[i][0] + dir][enemySquares[i][1] - 1] ) {
					return;
				}
			}
			//Backwards Checks
			if("RB".includes(squares[enemySquares[i][0]][enemySquares[i][1]])) {
				//Backward - Right check
				if(enemySquares[i][0] - dir >= 0 && enemySquares[i][0] - dir < 8 && enemySquares[i][1] + 1 >= 0 && enemySquares[i][1] + 1 < 8) {
					if(!squares[enemySquares[i][0] - dir][enemySquares[i][1] + 1] ) {
						return;
					}
				}
				//Backward - Left check
				if(enemySquares[i][0] - dir >= 0 && enemySquares[i][0] - dir < 8 && enemySquares[i][1] - 1 >= 0 && enemySquares[i][1] - 1 < 8) {
					if(!squares[enemySquares[i][0] - dir][enemySquares[i][1] - 1] ) {
						return;
					}
				}
			}
		}
		for(let i = 0; i < enemySquares.length; i++) {
			let temp = new MoveTree(enemySquares[i]);
			this.getRouteHelper(enemySquares[i], 0, squares, temp);
			if(temp.moves.length > 1) {
				return;
			}
		}
		this.setState((state) => {
			return {winner: player}
		});

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
				<PlayAgainButton 
					winner={this.state.winner}
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
	switch(props.value) {
		case 'h':
			return (
				<div className="square">
					<div className="selectedSquare" onClick={props.onClick}>
					</div>
				</div>
			);
		case 'r':
			return (
				<div className="square">
				<div className="redSquare" onClick={props.onClick}>
				</div>
				</div>
			);
		case 'b':
			return (
				<div className="square">
				<div className="blackSquare" onClick={props.onClick}>
				</div>
				</div>
			);
		case 'R':
			return (
				<div className="square">
				<div className="redSquare" onClick={props.onClick}>
					<img src="logo192.png" alt="king" />
				</div>
				</div>
			);
		case 'B':
			return (
				<div className="square">
				<div className="blackSquare" onClick={props.onClick}>
					<img src="logo192.png" alt="king" />
				</div>
				</div>
			);
		default:
			return (
				<div className="square" onClick={props.onClick}>
				</div>
			);
			
	}
}

function PlayAgainButton(props) {
	if(props.winner) {
		return (
			<button type="button">Play Again?</button>
		);
	}
	return null;
}


// ===================

ReactDOM.render(
	<Game />,
	document.getElementById("root")
);


function MoveTree(src) {
	this.moves = [];
	this.moves.push(src);
}


