import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {HuulgaForm} from './HuulgaForm'


export class Huulga extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/back/huulga/"} component={HuulgaForm}/>
            </Switch>
        )

    }

}
