
import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import Employee from './Menu/Employee/EmployeeForm'
export class App extends Component {

    render() {
        return (

        <BrowserRouter>
                    <div className="container-fluid mt-0">
                        <div className="row d-flex flex-wrap">
                        <nav id="sidebarMenu" className="col-lg-2 d-md-block bg-light sidebar collapse shadow pt-5 mt-0 pl-3 h-100 position-fixed" >
                            <div className="sidebar-sticky ">
                                <ul className="nav flex-column ">
                                    <li className="nav-item m-1 pb-1"> 
                                        <NavLink  to={'/gov/org/bundle/'} activeClassName="active">
                                        <i className="fa fa-database text-primary"></i>&nbsp;ДЭД САН
                                        </NavLink>
                                    </li>
                                    <li className="nav-item m-1 pb-1">
                                        <NavLink  to={'/gov/'} activeClassName="active">
                                        <i className="fas fa-users text-primary" ></i>&nbsp;ХЭРЭГЛЭГЧ
                                        </NavLink>
                                    </li>
                                    <li className="nav-item m-1">
                                        <NavLink  to={'/gov/org/system/'} activeClassName="active">
                                        <i className='fas fa-university text-primary'></i>&nbsp;СИСТЕМ
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                        <div className="col-md-10">
                                <Switch>
                                    <Route path="/gov/" component={Employee}/>
                                    <Route path="/gov/org/bundle/" component={Employee}/>
                                    <Route path="/gov/org/system/" component={Employee}/>
                                </Switch>
                            </div>
                        </main>
                        </div>

                    </div>
        </BrowserRouter>
        )
    }
}