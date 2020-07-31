import React, { Component } from "react"
import "./style.css"
import {service} from './service'
import {Жагсаалт} from './Жагсаалт'
import {Switch , Route, Link, NavLink} from "react-router-dom"
import {Govorg_level_1} from './Govorg_level_1/index'
import {Govorg_level_2} from './Govorg_level_2/index'
import {Govorg_level_3} from './Govorg_level_3/index'
import {Govorg_level_4} from './Govorg_level_4/index'

export class Menu extends Component {
    constructor(props) {

        super(props)

        this.state = {
            user_count: 0,
        }
        this.userCount=this.userCount.bind(this)

    }

    componentDidMount() {
        this.userCount()
    }

    userCount() {
        service.userCount().then(({user_count}) => {
            this.setState({user_count})
        })
    }

    render() {
        const { user_count} = this.state
        return (
            <div className="container my-4 col-md-10 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className=" col-md-2">
                        <div className="list-group">
                            <NavLink className="nav-link" to="/back/user/" exact activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center col-md-12 ">
                                    Хэрэглэгч
                                    <span className="badge badge-light badge-pill text-primary" >{user_count}</span>
                                </div>
                            </NavLink>
                            <NavLink className="nav-link" to="/back/user/level/1/" activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                    1-р түвшин
                                </div>
                            </NavLink>
                            <NavLink className="nav-link" to="/back/user/level/2/" activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                    2-р түвшин
                                </div>
                            </NavLink>
                            <NavLink className="nav-link" to="/back/user/level/3/" activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                    3-р түвшин
                                </div>
                            </NavLink>
                            <NavLink className="nav-link" to="/back/user/level/4/" activeClassName="active">
                                <div className="list-group-item d-flex justify-content-between align-items-center col-md-12">
                                    4-р түвшин
                                </div>
                            </NavLink>
                        </div>
                    </div>
                    <div className=" col-md-10">
                        <Switch>
                            <Route path="/back/user/" exact component={Жагсаалт} />
                            <Route path="/back/user/level/1/" component={Govorg_level_1} />
                            <Route path="/back/user/level/2/" component={Govorg_level_2} />
                            <Route path="/back/user/level/3/" component={Govorg_level_3} />
                            <Route path="/back/user/level/4/" component={Govorg_level_4} />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}
