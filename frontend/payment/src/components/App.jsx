import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import {History} from './history'
import {Purchase} from './Purchase/Purchase'
import {PolygonPurchase} from './Purchase/PolygonPurchase'
import {Failed} from './Failed/Failed'
import {Details} from '../components/history/details'


export class App extends Component {

    render() {
        return (
            <BrowserRouter>
              <Switch>
                <Route exact path={"/payment/purchase/:id/"} component={Purchase} />
                <Route exact path={"/payment/purchase/polygon/:id/"} component={PolygonPurchase} />
                <Route path={"/payment/failed/:id/"} component={Failed} />
                <Route path={"/payment/history/api/details/:id/"} component={Details} />
                <Route path="/payment/history/" component={History}/>
              </Switch>
          </BrowserRouter>
        )
    }
}
