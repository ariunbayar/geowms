import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import { DanForm } from './TsegUstsan/DanForm';
import Forms from './TsegPersonal/Form'

export class Bar extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 py-0 my-0 ">
                            <ul className="list-group list-group-horizontal col-md-8 my-0   list-unstyled">
                                <li className="col-md-9" >
                                <NavLink   to="/profile/tseg-personal/tseg-info/tseg-personal/" className="list-group-item col-md-12 mr-2 text-center" activeClassName="text-white gp-bg-primary">
                                    Шинээр байгуулсан цэг тэмдэгтийн <br/>мэдээллийг илгээх
                                </NavLink>
                                </li>
                                <li className="col-md-9">
                                <NavLink  to="/profile/tseg-personal/tseg-info/tseg-ustsan/" className="list-group-item col-md-12 ml-2 text-center " activeClassName="text-white gp-bg-primary">
                                          Устсан цэг тэмдэгтийн <br/>мэдээллийг илгээх
                                </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                <Switch>
                            <Route path="/profile/tseg-personal/tseg-info/tseg-ustsan/" component={DanForm}/> 
                            <Route path="/profile/tseg-personal/tseg-info/tseg-personal/" component={Forms}/> 
                            <Route exact path="/profile/tseg-personal/"/>
                 </Switch>
                </div>
            </div>
        )
    }
}