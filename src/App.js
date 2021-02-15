import './App.css';

import Puzzle from './Puzzle';

function App() {
  return (
    <div className="App">
      <Puzzle
        picture="img/jonathan-kemper-9tamF4J0vLk-unsplash.jpg"
        pictureDimensions={{w: 6000, h: 4000}}
        pieceDimensions={{w: 12, h: 8}}
      />
    </div>
  );
}

export default App;
