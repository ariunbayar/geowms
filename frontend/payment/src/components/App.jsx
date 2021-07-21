import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";

import { DisplayNotif } from '@utils/Notification'
import DisplayModal from "@utils/Modal/DisplayModal"

import {History} from './history'
import {Purchase} from './Purchase/Purchase'
import {PolygonPurchase} from './Purchase/PolygonPurchase'
import {Failed} from './Failed/Failed'
import {Details} from '../components/history/details'
import Test from './test/Index'

export class App extends Component {

  setNotAndModal(fn, key) {
    global[key] = fn
  }

  render() {
      return (
          <BrowserRouter>
            <DisplayModal getModalFunc={(fn) => this.setNotAndModal(fn, 'MODAL')}/>
            <DisplayNotif getNotifFunc={(fn) => this.setNotAndModal(fn, 'NOTIF')}/>
            <Switch>
              <Route exact path={"/payment/purchase/:id/"} component={Purchase} />
              <Route exact path={"/payment/purchase/polygon/:id/"} component={PolygonPurchase} />
              <Route path={"/payment/failed/:id/"} component={Failed} />
              <Route path={"/payment/history/api/details/:id/"} component={Details} />
              <Route path="/payment/history/" component={History}/>
              {/* <Route path="/payment/test/" component={Test}/> */}
            </Switch>
        </BrowserRouter>
      )
  }
}
