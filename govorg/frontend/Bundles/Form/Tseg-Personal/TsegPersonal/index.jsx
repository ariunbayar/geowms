import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from './Form'
import TsegRequest from '../TsegRequest'
import { service } from "../../service"


export class TsegPersonal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            point_role_list: props.point_role_list,
        }
    }

    componentDidUpdate(pP, pS) {
        const { point_role_list } = this.props
        if(pP.point_role_list != point_role_list) {
            this.setState({ point_role_list })
        }
    }

    render() {
        const { point_role_list } = this.state
        return (
            <Switch>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/"} component={(props) =><TsegRequest {...props} point_role_list={point_role_list}/>}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/add/"} component={(data)=><Forms data={data}/>}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/:id/засах/"} component={(data)=><Forms data={data}/>}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/:id/шийдвэрлэх/"} component={(data)=><Forms data={data} only_see={true} point_role_list={point_role_list}/>}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/:id/харах/"} component={(data)=><Forms data={data} only_see={true} no_buttons={true}/>}/>
            </Switch>
        )

    }

}
