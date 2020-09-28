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
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 py-0 my-0 ">
                            <ul className="list-group list-group-horizontal col-md-8 my-0   list-unstyled">
                                <li className="col-md-9" >
                                <NavLink to="/gov/froms/tseg-info/tsegpersonal/tseg-personal/" className="list-group-item col-md-12 mr-2 text-center" activeClassName="text-white gp-bg-primary">
                                        Шинээр байгуулсан цэг тэмдэгтийн <br/>мэдээллийг илгээх
                                </NavLink>
                                </li>
                                <li className="col-md-9">
                                <NavLink to="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/" className="list-group-item col-md-12 ml-2 text-center " activeClassName="text-white gp-bg-primary">
                                            Устсан цэг тэмдэгтийн <br/>мэдээллийг илгээх
                                </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                <Switch>
                    {perm_view ? <Route path="/gov/froms/tseg-info/tsegpersonal/tseg-personal/" component={()=><TsegPersonal perms={this.props.perms}/>}/> : null}
                    {perm_view ? <Route path="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/" component={()=><TsegUstsan perms={this.props.perms}/>}/> : null}
                    <Route exact path="/gov/froms/"/>
                </Switch>
                </div>
            </div>
        )
    }
}