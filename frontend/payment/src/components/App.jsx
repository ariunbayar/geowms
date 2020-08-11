import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";

import {Purchase} from './Purchase'
import {Failed} from './Failed'
import {Success} from './Success'


export class App extends Component {

    render() {
        return (
            <BrowserRouter>
              <Switch>
                <Route path={"/payment/purchase/:id/"} component={Purchase} />
                <Route path={"/payment/failed/:id/"} component={Failed} />
                <Route path={"/payment/success/:id/"} component={Success} />
              </Switch>
          </BrowserRouter>
        )
    }
}