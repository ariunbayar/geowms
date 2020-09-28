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
            <div className="container my-3 p-3 mb-5 shadow">
            {perm_view ?
                <div className="row">
                    <div className="col-md-2 ">
                        <div className="my-0">
                            <div className="list-group border">
                                <NavLink className="menu" exact to={'/gov/froms/tseg-info/'} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12 border-0">
                                        Цэгийн мэдээлэл
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 p-0">
                        <Switch>
                            <Route path="/gov/froms/tseg-info/" component={()=><Bar perms={this.props.perms}/>}/>
                        </Switch>
                    </div>
                </div>
                :
                null
            }
        </div>
        )
    }
}
