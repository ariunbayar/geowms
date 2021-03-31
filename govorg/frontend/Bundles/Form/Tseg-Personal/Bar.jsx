import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {TsegPersonal} from './TsegPersonal'
import {TsegUstsan} from './TsegUstsan'
import {InspList} from './InspireTsegList'
import { service } from "../service"

export class Bar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            point_role_list: {},
        }
        this.getEmpRole = this.getEmpRole.bind(this)
    }

    componentDidMount() {
        this.getEmpRole()
    }

    getEmpRole() {
        service
        .getEmpRole()
        .then(({ point_role_list }) => {
            this.setState({ point_role_list })
        })
    }

    render() {
        const { point_role_list } = this.state
        return (
            <div>
                <Switch>
                    <Route path="/gov/forms/tseg-info/tsegpersonal/tseg-personal/"  component={(props) =><TsegPersonal {...props} point_role_list={point_role_list}/>}/>
                    <Route path="/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/"  component={(props) =><TsegUstsan {...props} point_role_list={point_role_list}/>}/>
                    <Route path="/gov/forms/tseg-info/tsegpersonal/inspire-tseg/"  component={(props) =><InspList {...props} point_role_list={point_role_list}/>}/>
                    <Route exact path="/gov/forms/"/>
                </Switch>
            </div>
        )
    }
}
