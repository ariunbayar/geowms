import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from './Form'
import {FormList} from './FormList'

export class TsegPersonal extends Component {

    constructor(props) {
        super(props)
        
    }            

    render() {
        
        return (
            <Switch>
                <Route exact path={"/back/froms/tseg-info/tsegpersonal/tseg-personal/"} component={FormList}/>
                <Route exact path={"/back/froms/tseg-info/tsegpersonal/tseg-personal/add/"} component={Forms}/>
                <Route  exact path={"/back/froms/tseg-info/tsegpersonal/tseg-personal/:id/засах/"} component={Forms}/>
            </Switch>
        )

    }

}