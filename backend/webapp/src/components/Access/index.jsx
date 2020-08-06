import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {LogOutLog} from './LogOutLog/LogOutLog'
import {LoginLog} from './LoginLog/LoginLog'
import {PageLog} from './PageLog/PageLog'


export class Access extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row container">
                    <div className="col-md-12">
                        <ul className="list-group list-group-horizontal col-md-12">
                            <NavLink to="/back/access/login/" className="list-group-item col-md-4" activeClassName="text-white gp-bg-primary">
                                Хэрэглэгчийн нэвтэрсэн тэмдэглэл
                            </NavLink>
                            <NavLink to="/back/access/logout/" className="list-group-item col-md-4" activeClassName="text-white gp-bg-primary">
                                Хэрэглэгчийн гарсан тэмдэглэл
                            </NavLink>
                            <NavLink to="/back/access/page/" className="list-group-item col-md-4" activeClassName="text-white gp-bg-primary">
                                Хуудас хандалтын тэмдэглэл
                            </NavLink>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Switch>
                            <Route path={"/back/access/login/"} component={LoginLog}/>
                            <Route path={"/back/access/logout/"} component={LogOutLog}/>
                            <Route path={"/back/access/page/"} component={PageLog}/>
                        </Switch>
                    </div>
                </div>
            </div>
        )

    }

}
