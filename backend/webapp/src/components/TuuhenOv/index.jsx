import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Form} from './Form'


export class TuuhenOv extends Component {

    constructor(props) {
        super(props)
        
    }

    render() {
        
        return (
            <Switch>
                <Route path={"/back/tuuhen-ov/"} component={Form}/>
            </Switch>
        )

    }

}
