import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';


class Box extends React.Component {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col)
	}
	
	render() {
		return(
			<div 
			className={this.props.boxClass}
			id={this.props.id}
			onClick={this.selectBox}
			></div>
		)
	}
}

class Grid extends React.Component {

    render() {
		const width = this.props.cols * 14;
		var rowArr = [];
		var boxClass = "";
		
		for (var i = 0; i < this.props.rows; i++){
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;
				boxClass = this.props.gridFull[i][j] ? "box on" : "box off"
				rowArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
						selectBox={this.props.selectBox}
					/>
				);
			}
		}

        return(
            <div className="grid" style={{width: width}}>
                {rowArr}
            </div>
        )
    }
}

class Buttons extends React.Component {
	handleSelect = (evt) => {
		this.props.gridSize(evt);
	}

	render() {
		return(
			<div className="center">
				<ButtonToolbar>
					<button className= "btn btn-default" onClick={this.props.playButton}>Play</button>
					<button className= "btn btn-default" onClick={this.props.pauseButton}>Pause</button>
					<button className= "btn btn-default" onClick={this.props.clear}>Clear</button>
					<button className= "btn btn-default" onClick={this.props.slow}>Slow</button>
					<button className= "btn btn-default" onClick={this.props.fast}>Fast</button>
					<button className= "btn btn-default" onClick={this.props.seed}>Seed</button>
					<DropdownButton
						title = "Grid Size"
						id = "size-menu"
						onSelect = {this.handleSelect}
					>
						<MenuItem eventKey="1">20x10</MenuItem>
						<MenuItem eventKey="2">50x30</MenuItem>
						<MenuItem eventKey="3">70x50</MenuItem>
					</DropdownButton>
				</ButtonToolbar>
			</div>
		)
	}
}

class Main extends React.Component {
	constructor() {
		super();
		this.speed = 100;
		this.rows = 30;
		this.cols = 50;
		this.state= {
			generations: 0,
			gridFull: createGrid(this.rows, this.cols)
		}
	}
	selectBox = (row, col) => {
		let gridCopy = arrayClone(this.state.gridFull)
		gridCopy[row][col] = !gridCopy[row][col]
		this.setState({ 
			gridFull: gridCopy
		})
	}
	
	seed = () => {
		let seedGrid = arrayClone(this.state.gridFull)
		for (var i = 0; i < this.rows; i++){
			for (var j = 0; j < this.cols; j++) {
				if (Math.floor(Math.random() * 4) === 1) {
					seedGrid[i][j] = true;
				}
			}
		}
		this.setState({
			gridFull: seedGrid
		});
	}

	playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

	pauseButton = () => {
		clearInterval(this.intervalId);
	}
	
	slow = () => {
		console.log("Slow")
		this.speed = 1000;
		this.playButton();
	}
	
	fast = () => {
		this.speed = 100;
		this.playButton();
	}

	clear = () => {
		var clearGrid = createGrid(this.rows, this.cols);
		this.setState({
			gridFull: clearGrid,
			generations: 0
		});
		this.pauseButton();
	}


	gridSize = (size) => {
		switch (size) {
			case "1":
				this.cols=20;
				this.rows=10;
				break
			case "2":
				this.cols=50;
				this.rows=30;
			break
			default:
				this.cols=70;
				this.rows=50;
		}
		this.clear();
	}


	
	play = () => {
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
			  let count = 0;
			  if (i > 0) if (g[i - 1][j]) count++;
			  if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
			  if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
			  if (j < this.cols - 1) if (g[i][j + 1]) count++;
			  if (j > 0) if (g[i][j - 1]) count++;
			  if (i < this.rows - 1) if (g[i + 1][j]) count++;
			  if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
			  if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
			  if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
			  if (!g[i][j] && count === 3) g2[i][j] = true;
			}
		};
		this.setState({
			gridFull: g2,
			generations: this.state.generations + 1
		});
	}

	componentDidMount() {
		this.seed();
		this.playButton();
	}

	render() 
		{
			return(
				<div>
					<h1>Game of Life</h1>
					<Buttons
						playButton = {this.playButton}
						pauseButton = {this.pauseButton}
						slow = {this.slow}
						fast = {this.fast}
						clear = {this.clear}
						seed = {this.seed}
						gridSize = {this.gridSize}
					/>
					<Grid 
					gridFull = {this.state.gridFull}
					rows = {this.rows}
					cols = {this.cols}
					selectBox = {this.selectBox}
					/>
					<h2>Generations: {this.state.generations}</h2>
				</div>
			)
		}
}

function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr))
}

function createGrid(rows, cols) {
	return Array(rows).fill(Array(cols).fill(false))
}

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
