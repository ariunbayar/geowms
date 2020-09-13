import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";

import {Purchase} from './Purchase/Purchase'
import {Failed} from './Failed/Failed'
import {Details} from '../../../profile/src/components/history/details'


export class App extends Component {

    render() {
        return (
            <BrowserRouter>
              <Switch>
                <Route path={"/payment/purchase/:id/"} component={Purchase} />
                <Route path={"/payment/failed/:id/"} component={Failed} />
                <Route path={"/profile/all/api/details/:id/"} component={Details} />
              </Switch>
          </BrowserRouter>
        )
    }
}