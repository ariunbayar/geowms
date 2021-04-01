
import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";

import {Info} from './information/info'
import {Bar} from './tsegPersonal/Index'
export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_display: false,
        }
    }

    render() {
        return (
          <BrowserRouter>
            <div className="container my-3 p-3 mb-5">
                <div className="row">
                    <div className="col-md-2">
                        <div className="my-0 pt-2">
                            <div className="list-group border">
                                <NavLink className="menu" exact to={'/profile/api/'} activeClassName="active">
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12 border-0">
                                        Хувийн мэдээлэл
                                    </div>
                                </NavLink>
                                <NavLink className="menu" exact to={"/profile/tseg-personal/"} activeClassName="active"
                                    onClick={() => this.setState({ is_display: true })}
                                >
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12 border-0">
                                        Цэг тэмдэгтийн мэдээлэл
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 p-0">
                        <Switch>
                            <Route path="/profile/api/" component={Info}/>
                            <Route path="/profile/tseg-personal/"
                                component={(props) => <Bar {...props} is_display={this.state.is_display} />}
                            />
                        </Switch>
                    </div>
                </div>
            </div>
          </BrowserRouter>
        )
    }
}
