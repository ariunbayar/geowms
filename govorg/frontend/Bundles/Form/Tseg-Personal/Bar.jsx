import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {TsegPersonal} from './TsegPersonal/index'
import {TsegUstsan} from '../Tseg-Personal/TsegUstsan/index'

export class Bar extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.props.perms
        return (
            <div>
                <Switch>
                    {perm_view ? <Route path="/gov/froms/tseg-info/tsegpersonal/tseg-personal/" component={()=><TsegPersonal perms={this.props.perms}/>}/> : null}
                    {perm_view ? <Route path="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/" component={()=><TsegUstsan perms={this.props.perms}/>}/> : null}
                    <Route exact path="/gov/froms/"/>
                </Switch>
            </div>
        )
    }
}
