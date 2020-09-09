import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {CrudEvenLog} from './CrudEvenLog/CrudEvenLog'
import {LoginLog} from './LoginLog/LoginLog'
import {PageLog} from './PageLog/PageLog'


export class Access extends Component {

    constructor(props) {
        super(props)

        this.default_url = '/back/access/login/'

    }

    componentDidMount() {
        if (this.props.location.pathname.endsWith('access/')) {
            this.props.history.push(this.default_url)
        }
    }

    componentDidUpdate() {
        if (this.props.location.pathname.endsWith('access/')) {
            this.props.history.push(this.default_url)
        }
    }

    render() {

        return (
            <div className="container my-4 shadow-lg mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12 px-0">
                        <ul className="list-group list-group-horizontal col-md-12 pr-0">
                            <NavLink to="/back/access/login/" className="list-group-item col-md-4" activeClassName="text-white gp-bg-primary">
                                Хэрэглэгчийн оролт гаралтын тэмдэглэл
                            </NavLink>
                            <NavLink to="/back/access/logout/" className="list-group-item col-md-4" activeClassName="text-white gp-bg-primary">
                                Хийгдсэн үйлдлийн тэмдэглэл
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
                            <Route path={"/back/access/login/"} component={LoginLog} />
                            <Route path={"/back/access/logout/"} component={CrudEvenLog} />
                            <Route path={"/back/access/page/"} component={PageLog} />
                        </Switch>
                    </div>
                </div>
            </div>
        )

    }

}
