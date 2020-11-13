
import React, { Component } from "react"
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import OrgRequestForm from './orgRequestForm'

export default class OrgRequest extends Component {

    constructor(props) {
        super(props)
        this.state={
        }
    }

    render() {
        return (
            <div className="card">
              <div className="card-body">
                    <Switch>
                        <Route path="/gov/org-request/" component={(props) => <OrgRequestForm {...props} refreshCount={this.props.refreshCount}/>}/>
                    </Switch>
              </div>
           </div>
        )
    }
}
