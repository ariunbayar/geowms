
import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import Employee from './Menu/Employee/EmployeeForm'
import Bundle from './Menu/Bundle/Bundle'
import { TuuhenOv } from './Menu/TuuhenOv'

export class App extends Component {

    constructor(props) {
        super(props)
        this.state={
            perms: props.org.perms,
            org_level: props.org.org_level,
            name: props.org.name,
            tuuhen_ov: {}
        }
    }

    componentDidMount(){
        const { perms } = this.state
        perms.map((perm) => {
            if(perm.module_id == 1){
                this.setState({tuuhen_ov: perm})
            }
        })
    }

    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.state.tuuhen_ov
        return (
        <BrowserRouter>
            <div className="container-fluid mt-0">
                <div className="row d-flex flex-wrap">
                <nav id="sidebarMenu" className="col-lg-2 d-md-block bg-light sidebar collapse shadow pt-5 mt-0 pl-3 h-100 position-fixed" >
                    <div className="sidebar-sticky ">
                        <ul className="nav flex-column ">
                            <li className="nav-item m-1 pb-1">
                                <NavLink  exact to={'/gov/bundle/'} activeClassName="active">
                                <i className="fa fa-database text-primary"></i>&nbsp;ДЭД САН
                                </NavLink>
                            </li>
                            <li className="nav-item m-1 pb-1">
                                <NavLink  to={'/gov/'} activeClassName="active">
                                <i className="fa fa-users text-primary" ></i>&nbsp;ХЭРЭГЛЭГЧ
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <NavLink  to={'/gov/system/'} activeClassName="active">
                                <i className='fa fa-university text-primary'></i>&nbsp;СИСТЕМ
                                </NavLink>
                            </li>
                            {perm_view ?
                            <li className="nav-item m-1">
                                <NavLink  to={'/gov/tuuhen-ov/'} activeClassName="active">
                                    <i className='fa fa-history  text-primary'></i>&nbsp;Түүхэн өв бүртгэл
                                </NavLink>
                            </li>
                            :
                            null
                            }
                        </ul>
                    </div>
                </nav>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                <div className="col-md-10">
                        <Switch>
                            {perm_view ?
                            <Route path="/gov/tuuhen-ov/"
                                component={()=><TuuhenOv perms={this.state.tuuhen_ov}/>}
                                />
                                :
                                null
                            }
                            <Route exact path="/gov/" component={Employee}/>
                            <Route exact path="/gov/bundle/" component={Bundle}/>
                        </Switch>
                    </div>
                </main>
                </div>

            </div>
        </BrowserRouter>
        )
    }
}