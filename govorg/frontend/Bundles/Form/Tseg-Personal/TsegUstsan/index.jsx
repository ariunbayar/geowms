import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {FormTseg} from './Form'
import {List} from './List'

export class TsegUstsan extends Component {

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
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/"} component={(props) =><List {...props} point_role_list={point_role_list}/>}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/add/"} component={(data)=><FormTseg data={data} point_role_list={point_role_list}/>}/>
                <Route exact path={"/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/:id/засах"} component={(data)=><FormTseg data={data}/>}/>
            </Switch>
        )

    }

}
