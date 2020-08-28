import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Form} from './Form'
import {List} from './List'


export class TsegUstsan extends Component {

    constructor(props) {
        super(props)
        
    }

    render() {
        
        return (
            <Switch>
                <Route exact path={"/back/froms/tseg-ustsan/"} component={List}/>
                <Route exact path={"/back/froms/tseg-ustsan/add/"} component={Form}/>
                <Route exact path={"/back/froms/tseg-ustsan/:id/засах"} component={Form}/>
            </Switch>
        )

    }

}
