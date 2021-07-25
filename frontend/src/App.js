import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddMovie from "./components/AddMovie";
import MovieDB from "./components/MovieDB";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={MovieDB} />
          <Route exact path="/upload" component={AddMovie} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
