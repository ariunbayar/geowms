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
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/"} component={FormList}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/add/"} component={(data)=><Forms data={data}/>}/>
                <Route  exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/:id/:t_type/засах/"} component={(data)=><Forms data={data}/>}/>
            </Switch>
        )

    }

}
