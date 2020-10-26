import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from './Form'
import {FormList} from './FormList'

export class TsegPersonal extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.props.perms
        return (
            <Switch>
                {perm_view ? <Route exact path={"/gov/froms/tseg-info/tsegpersonal/tseg-personal/"} component={()=><FormList perms={this.props.perms}/>}/> : null}
                {perm_create ? <Route exact path={"/gov/froms/tseg-info/tsegpersonal/tseg-personal/add/"} component={(data)=><Forms data={data} perms={this.props.perms}/>}/> : null}
                {perm_view && perm_create && perm_remove ? <Route  exact path={"/gov/froms/tseg-info/tsegpersonal/tseg-personal/:id/:t_type/засах/"} component={(data)=><Forms data={data} perms={this.props.perms}/>}/> : null}
            </Switch>
        )

    }

}