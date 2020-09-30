import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {Bar} from './Tseg-Personal/Bar'
export class Forms extends Component {

    constructor(props) {
        super(props)

    }


    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.props.perms
        return (
            <div className="">
                {perm_view ?
                    
                    <Switch>
                        <Route path="/gov/froms/tseg-info/" component={()=><Bar perms={this.props.perms}/>}/>
                    </Switch>
                    :
                    null
                }
            </div>
        )
    }
}
