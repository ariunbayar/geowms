
import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import {History} from './history'

import {Info} from './information/info'
export class App extends Component {

    render() {
        return (
          <BrowserRouter>
            <div className="container my-3 p-3 mb-5">
                <div className="row">
                    <div className="col-md-2 p-0">
                        <div className="my-0">
                            <div className="list-group border">
                                <NavLink className="menu" exact to={'/profile/api/'} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12 border-0">
                                        Хувийн мэдээлэл
                                    </div>
                                </NavLink>
                                <NavLink className="menu" exact to={`/profile/all/`} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12 border-0">
                                        Худалдан авалт
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 p-0">
                        <Switch>
                            <Route path="/profile/all/" component={History}/>
                            <Route path="/profile/api/" component={Info}/>
                        </Switch>
                    </div>
                </div>
            </div>
          </BrowserRouter>
        )
    }
}
