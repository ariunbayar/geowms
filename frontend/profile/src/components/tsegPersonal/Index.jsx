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
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 py-0 my-0">
                                    <NavLink
                                        to="/profile/tseg-personal/tseg-info/tseg-ustsan/"
                                        className="list-group-item col-md-12 ml-2 text-center"
                                        activeClassName="text-white gp-bg-primary"
                                    >
                                        Устсан цэг тэмдэгтийн мэдээллийг илгээх
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div>
                        <Switch>
                            <Route path="/profile/tseg-personal/tseg-info/tseg-ustsan/" component={DanForm}/>
                            <Route exact path="/profile/tseg-personal/"/>
                        </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}