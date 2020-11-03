
import React, { Component } from "react"
import {Switch, Route} from "react-router-dom";
import ChangeRequestForm from './changeRequestForm'

export default class ChangeRequest extends Component {

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
                        <Route path="/gov/history/" component={ChangeRequestForm}/>
                    </Switch>
              </div>
           </div>
        )
    }
}
