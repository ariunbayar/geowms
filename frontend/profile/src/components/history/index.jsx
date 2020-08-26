import React, {Component} from "react";
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import HistoryForm from './historyForm'

export  class History extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
        
          <Switch>
            <Route exact path={"/profile/all/"}  component={HistoryForm} />      
          </Switch>
    );
  }
}