import React, {Component} from "react";
import { Switch, Route } from "react-router-dom";

import HistoryForm from './historyForm'
import { Details } from './details'

export  class History extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (

          <Switch>
            <Route exact path={"/payment/history/"}  component={HistoryForm}/>
            <Route exact path={'/payment/history/api/details/:id/'} component={Details}/>
          </Switch>
    );
  }
}