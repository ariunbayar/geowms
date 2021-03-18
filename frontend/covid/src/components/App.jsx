import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import {CovidPage} from './covid/Index'
import CovidDashboard from './covid_dashboard'


export class App extends Component {

    render() {
        return (
          <div className="bg-light">
            <BrowserRouter>
                <Switch>
                  <Route path="/covid/" component={CovidPage}/>
                  <Route path="/covid_dashboard/" component={CovidDashboard}/>
                </Switch>
            </BrowserRouter>
          </div>
        )
    }
}
