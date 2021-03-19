import React, { PureComponent } from 'react';
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import Navbar from "./components/Navbar"
import {Menu} from "./components/Menu"
import {Countries} from "./components/Countries"
import Graph from "./components/Graph"
import {Header} from "./components/Header"


class CovidDashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">

                        <div className="col-md-12 border border-danger" >
                            <Header />
                        </div>

                        <div className="col-md-3" style={{height: '1000px'}}>
                            <Menu/><br/>
                            <Countries/>
                        </div>

                        <div className="col-md-9 border border-danger" style={{height: '1000px'}}>
                            <div className="row">
                                <div className="col-md-12 border border-danger" style={{height: '50px'}}>
                                    <Navbar />
                                </div>
                                <div className="col-md-12" style={{height: '950px', overflow: "auto"}}>
                                    <Switch>
                                        <Route path={"/covid_dashboard/graph/"} component={Graph} />
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CovidDashboard;
