import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import {OpenLayerPage} from './OpenLayer'

export class App extends Component {

    render() {
        return (
          <div className="bg-light">
            <BrowserRouter>
                <Switch>
                  {/* <Route path="/open-layer/" component={(props) => <OpenLayerPage {...props} open_layer={this.props.open_layer}/>}/> */}
                </Switch>
            </BrowserRouter>
          </div>
        )
    }
}
