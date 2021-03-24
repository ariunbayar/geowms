import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from './Form'
import {FormList} from './FormList'
import TsegRequest from '../TsegRequest'

export class TsegPersonal extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/"} component={TsegRequest}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/add/"} component={(data)=><Forms data={data}/>}/>
                <Route  exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/:id/засах/"} component={(data)=><Forms data={data}/>}/>
                <Route  exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/:id/шийдвэрлэх/"} component={(data)=><Forms data={data} only_see={true}/>}/>
                <Route  exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/:id/харах/"} component={(data)=><Forms data={data} only_see={true} no_buttons={true}/>}/>
            </Switch>
        )

    }

}
