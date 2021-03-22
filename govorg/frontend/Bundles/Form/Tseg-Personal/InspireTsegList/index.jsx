import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from '../TsegPersonal/Form'
import InspireTsegList from './InspireTsegList'

export class InspList extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route path={"/gov/forms/tseg-info/tsegpersonal/inspire-tseg/"} component={InspireTsegList}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/inspire-tseg/:id/засах/"} component={(data)=><Forms data={data} />}/>
            </Switch>
        )
    }
}
