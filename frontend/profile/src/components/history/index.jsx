import React, {Component} from "react";
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import HistoryForm from './historyForm'
import {Info} from '../information/info'
import { rotate } from "ol/transform"
import { Details } from './details'

export  class History extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (

          <Switch>
            <Route exact path={"/profile/all/"}  component={HistoryForm}/>
            <Route exact path={"/profile/api/"}  component={Info}/>
            <Route exact path={'/profile/all/api/details/:id/'} component={Details}/>
          </Switch>
    );
  }
}