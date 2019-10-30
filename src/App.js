import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";

import Home from "./views/Home";
import FindTrails from "./views/FIndTrails";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/findtrails' component={FindTrails} />
          <Route path='/findtrails/:id' />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
