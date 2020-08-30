import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Form} from './Form'
import {FormList} from './FormList'


export class TsegPersonal extends Component {

    constructor(props) {
        super(props)
        
    }

    render() {
        
        return (
            <Switch>
                <Route exact path={"/back/froms/tseg-personal/"} component={FormList}/>
                <Route exact path={"/back/froms/tseg-personal/add/"} component={Form}/>
                <Route exact path={"/back/froms/tseg-personal/:id/засах/"} component={Form}/>
            </Switch>
        )

    }

}
