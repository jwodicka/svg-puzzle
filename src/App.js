import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import Puzzle from './Puzzle';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/puzzle">
            <Puzzle
              picture="img/jonathan-kemper-9tamF4J0vLk-unsplash.jpg"
              pictureDimensions={{w: 6000, h: 4000}}
              pieceDimensions={{w: 12, h: 8}}
            />
          </Route>
          <Route path="/slicer">
            <h1>Slicer options will be here later.</h1> 
          </Route>
          <Route path="/">
            <div>
              <Link to="/puzzle">Puzzle</Link>
              <Link to="/slicer">Slicer</Link>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
