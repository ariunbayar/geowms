import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from '../TsegPersonal/Form'
import InspireTsegList from './InspireTsegList'

export class InspList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            point_role_list: props.point_role_list,
        }
    }

    componentDidUpdate(pP, pS) {
        if(pP.point_role_list != this.props.point_role_list) {
            this.setState({point_role_list})
        }
    }

    render() {
        const { point_role_list } = this.state
        return (
            <Switch>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/inspire-tseg/"}  component={(data)=><InspireTsegList data={data} point_role_list={point_role_list}/>}/>
                <Route path={"/gov/forms/tseg-info/tsegpersonal/inspire-tseg/:geo_id/засах/"} component={(data)=><Forms data={data} />}/>
                <Route path={"/gov/forms/tseg-info/tsegpersonal/inspire-tseg/:geo_id/detail/"} component={(data)=><Forms data={data} only_see={true} no_buttons={true}/>}/>
            </Switch>
        )
    }
}
