import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import {CovidPage} from './covid/Index'

export class App extends Component {

    render() {
        return (
          <BrowserRouter>
              <Switch>
                <Route path="/covid/" component={CovidPage}/>
              </Switch>
          </BrowserRouter>
        )
    }
}
