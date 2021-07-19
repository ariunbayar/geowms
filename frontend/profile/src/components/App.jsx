
import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";

import {Info} from './information/info'
import {Bar} from './tsegPersonal/Index'
import EmailUpdate from './information/EmailUpdate'

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
                                <NavLink className="menu" to={'/profile/'}>
                                    <div className="list-group-item d-flex justify-content-between align-items-center col-md-12 border-0">
                                        Хувийн мэдээлэл
                                    </div>
                                </NavLink>
                                <NavLink className="menu" to={"/a/tseg-personal/"}
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
                            <Route exact path="/profile/" component={Info} activeClassName="selected"/>
                            <Route path="/profile/update-mail/" component={EmailUpdate} />
                            <Route path="/a/tseg-personal/"
                                component={(props) => <Bar {...props} is_display={this.state.is_display} activeClassName="selected"/>}
                            />
                        </Switch>
                    </div>
                </div>
            </div>
          </BrowserRouter>
        )
    }
}
