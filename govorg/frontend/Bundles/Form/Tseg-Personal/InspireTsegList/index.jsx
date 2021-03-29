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
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/inspire-tseg/"} component={InspireTsegList}/>
                <Route path={"/gov/forms/tseg-info/tsegpersonal/inspire-tseg/:geo_id/засах/"} component={(data)=><Forms data={data} />}/>
                <Route path={"/gov/forms/tseg-info/tsegpersonal/inspire-tseg/:geo_id/detail/"} component={(data)=><Forms data={data} only_see={true} no_buttons={true}/>}/>
            </Switch>
        )
    }
}
