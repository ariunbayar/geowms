import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import { TuuhenOv } from './TuuhenOv'
import { TsegPersonal } from './TsegPersonal'
import { TsegUstsan } from './TsegUstsan'

export class Forms extends Component {

    constructor(props) {
        super(props)

    }


    render() {
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row container">
                    <div className="col-md-12">
                        <ul className="list-group list-group-horizontal col-md-12">
                            <NavLink to="/back/froms/" className="list-group-item col-md-4" activeClassName="text-white gp-bg-primary">
                                Түүхэн өв бүртгэлийн хүсэлт
                            </NavLink>
                            <NavLink to="/back/froms/tseg-personal/" className="list-group-item col-md-4" activeClassName="text-white gp-bg-primary">
                                Цэг бүртгэлийн хүсэлт
                            </NavLink>
                            <NavLink to="/back/froms/tseg-ustsan/" className="list-group-item col-md-4" activeClassName="text-white gp-bg-primary">
                                Цэг устсан хүсэлт
                            </NavLink>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Switch>
                            <Route exact path="/back/froms/" component={TuuhenOv}/>
                            <Route path="/back/froms/tseg-personal/" component={TsegPersonal}/>
                            <Route path="/back/froms/tseg-ustsan/" component={TsegUstsan}/>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}
