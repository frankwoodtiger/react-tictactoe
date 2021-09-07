import React from 'react';
import '../App.css';
import { getSymbol } from './utils'
import Box from './Box'

const DEFAULT_DIMENSION = 3;
const DEFAULT_BOX_STATE = null;

const createDefaultGameState = (dimension) => {
  const DEFAULT_BOX_OBJ = {
    boxState: DEFAULT_BOX_STATE,
    color: false
  };
  const DEFAULT_GAME_STATE = {
    matrix: [],
    isPlayerOne: true,
    isGameFinished: false,
    showDimensionControl: false,
    dimension: dimension
  };
  
  for (let i = 0; i < dimension; i++) {
    DEFAULT_GAME_STATE.matrix.push([]);
    for (let j = 0; j < dimension; j++) {
      DEFAULT_GAME_STATE.matrix[i].push({...DEFAULT_BOX_OBJ});
    }
  }
  return DEFAULT_GAME_STATE;
}

class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(createDefaultGameState(DEFAULT_DIMENSION)));
    this.restartOnClickHandler = this.restartOnClickHandler.bind(this);
    this.resetDimensionOnClickHandler = this.resetDimensionOnClickHandler.bind(this);
    this.dimensionRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    // only compute when dimension are the same, to avoid null pointer when resetting dimension
    if (prevState.dimension === this.state.dimension) {
      let newMatrix = prevState.matrix.map((row) => row.slice());
      let hasWinStrike = this.detectAndMarkWinStrike(newMatrix);
      if (!prevState.isGameFinished && hasWinStrike) {
        this.setState({
          matrix: newMatrix,
          isGameFinished: true
        });
      }
    }
  }

  boxOnClickHandler(rowIdx, colIdx) {
    if (!this.state.isGameFinished && this.state.matrix[rowIdx][colIdx].boxState === DEFAULT_BOX_STATE) {
      this.setState((previousState, props) => {
        let newMatrix = previousState.matrix.map((row) => row.slice());
        newMatrix[rowIdx][colIdx].boxState = previousState.isPlayerOne;
        return {
          matrix: newMatrix,
          isPlayerOne: !previousState.isPlayerOne
        }
      });
    }
  }

  restartOnClickHandler() {
    this.setState(JSON.parse(JSON.stringify(createDefaultGameState(this.state.dimension))));
  }

  resetDimensionOnClickHandler(e) {
    e.preventDefault();
    this.setState(JSON.parse(JSON.stringify(createDefaultGameState(this.dimensionRef.current.value))));
  }

  detectAndMarkWinStrike(matrix) {
    // Horizontal
    for (let i = 0; i < this.state.dimension; i++) {
      if (matrix[i].reduce((acc, boxObj) => acc && boxObj.boxState !== DEFAULT_BOX_STATE && boxObj.boxState === matrix[i][0].boxState, true)) {
        matrix[i].forEach(boxObj => boxObj.color = true);
        return true;
      }
    }

    // Vertical
    for (let i = 0; i < this.state.dimension; i++) {
      let vertical = [];
      for (let j = 0; j < this.state.dimension; j++) {
        vertical.push(matrix[j][i]);
      }
      if (vertical.every(boxObj => boxObj.boxState !== DEFAULT_BOX_STATE && boxObj.boxState === vertical[0].boxState)) {
        vertical.forEach(boxObj => boxObj.color = true);
        return true;
      }
    }

    // Diagonal
    let diagonal1 = [];
    let diagonal2 = [];
    for (let i = 0; i < this.state.dimension; i++) {
      diagonal1.push(matrix[i][i]);
      diagonal2.push(matrix[i][this.state.dimension - 1 - i]);
    }
    if (diagonal1.every(boxObj => boxObj.boxState !== DEFAULT_BOX_STATE && boxObj.boxState === diagonal1[0].boxState)) {
      diagonal1.forEach(boxObj => boxObj.color = true);
      return true;
    }
    if (diagonal2.every(boxObj => boxObj.boxState !== DEFAULT_BOX_STATE && boxObj.boxState === diagonal2[0].boxState)) {
      diagonal2.forEach(boxObj => boxObj.color = true);
      return true;
    }

    return false;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-text">
            <div>Tic Tac Toe</div>
            <div>Current Turn: {getSymbol(this.state.isPlayerOne)}</div>
          </div>
          <div>
            {this.state.matrix.map((row, rowIdx) => {
              return (
                <div key={`${rowIdx}`} className="row">
                    {row.map((boxObj, colIdx) => {
                      return <Box key={`${rowIdx}${colIdx}`}
                        onClickHandler={this.boxOnClickHandler.bind(this, rowIdx, colIdx)} 
                        boxObj={boxObj} />
                    })}
                </div>
              )
            })}
          </div>
          <div>
            <button onClick={this.restartOnClickHandler}>Restart</button>
            <button className={this.state.showDimensionControl ? "hide" : ""}
              onClick={() => this.setState({ showDimensionControl: true })}>Set Dimension</button>
            <form className={`dimension-group ${this.state.showDimensionControl ? "" : "hide"}`}
              onSubmit={(e) => this.resetDimensionOnClickHandler(e)}>
              <input type="text" defaultValue={this.state.dimension} ref={this.dimensionRef}/>
              <button type="submit">Confirm</button>
              <button type="button" onClick={() => this.setState({ showDimensionControl: false })}>Cancel</button>
            </form>
          </div>
        </header>
      </div>
    )
  };
}

export default TicTacToe;