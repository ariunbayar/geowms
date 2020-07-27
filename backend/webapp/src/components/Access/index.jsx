import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {AccessForm} from './AccessForm'


export class Access extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        
        return (
            <Switch>
                <Route exact path={"/back/access/"} component={AccessForm}/>
            </Switch>
        )

    }

}
