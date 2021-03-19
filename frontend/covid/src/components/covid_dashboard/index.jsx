import React, { PureComponent } from 'react';
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import Navbar from "./components/Navbar"
import {Menu} from "./components/Menu"
import {Countries} from "./components/Countries"
import Graph from "./components/Graph"
import {Header} from "./components/Header"

import {service} from './components/service'

class CovidDashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            mongol_data: [],
            update_time: '',
            mongol_zuruu: []
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        service
            .getDataDashboard()
            .then(({ success, data, update_time, zuruu }) => {
                this.setState({ datas: data[0]['children'], mongol_data: data[0], update_time, mongol_zuruu: zuruu })
            })
    }

    render() {
        const { datas, mongol_data, update_time, mongol_zuruu } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">

                        <div className="col-md-12 border border-danger" >
                            <Header />
                        </div>

                        <div className="col-md-3" style={{height: '1000px'}}>
                            <Menu
                                mongol_data={mongol_data}
                                update_time={update_time}
                                mongol_zuruu={mongol_zuruu}
                            /><br/>
                            <Countries
                                datas={datas}
                            />
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
