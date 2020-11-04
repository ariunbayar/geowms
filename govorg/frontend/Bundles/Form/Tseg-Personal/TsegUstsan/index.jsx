import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {FormTseg} from './Form'
import {List} from './List'

export class TsegUstsan extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.props.perms
        return (
            <Switch>
                    {perm_view ? <Route exact path={"/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/"} component={()=><List perms={this.props.perms}/>}/> : null}
                    {perm_create ? <Route exact path={"/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/add/"} component={(data)=><FormTseg data={data} perms={this.props.perms}/>}/> : null}
                    {perm_view && perm_remove && perm_create ? <Route exact path={"/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/:id/засах"} component={(data)=><FormTseg data={data} perms={this.props.perms}/>}/> : null}
            </Switch>
        )

    }

}