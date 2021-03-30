import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {TsegPersonal} from './TsegPersonal'
import {TsegUstsan} from './TsegUstsan'
import {InspList} from './InspireTsegList'
import { service } from "../../../service"

export class Bar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            emp_role: {},
        }
        this.getEmpRole = this.getEmpRole.bind(this)
    }

    componentDidMount() {
        this.getEmpRole()
    }

    getEmpRole() {
        service.getEmpRole().then(({roles}) =>{

        })
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/gov/forms/tseg-info/tsegpersonal/tseg-personal/" component={TsegPersonal}/>
                    <Route path="/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/" component={TsegUstsan}/>
                    <Route path="/gov/forms/tseg-info/tsegpersonal/inspire-tseg/" component={InspList}/>
                    <Route exact path="/gov/forms/"/>
                </Switch>
            </div>
        )
    }
}
