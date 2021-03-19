import React, { PureComponent } from 'react';
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import Navbar from "./components/Navbar"
import {Menu} from "./components/Menu"
import {Countries} from "./components/Countries"
import Graph from "./components/Graph"
import {Header} from "./components/Header"

import {service} from './components/service'
import CovidMap from './components/covid_map'
import Vaccine from './components/vaccine'
import Loader from '@utils/Loader'


class CovidDashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            mongol_data: [],
            update_time: '',
            mongol_zuruu: [],
            geo_id: '',
            is_loading: true
        }
        this.getGeoID = this.getGeoID.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getGeoID(geo_id){
        this.setState({ geo_id })
    }

    getData() {
        service
            .getDataDashboard()
            .then(({ success, data, update_time, zuruu }) => {
                this.setState({ datas: data[0]['children'], mongol_data: data[0], update_time, mongol_zuruu: zuruu, is_loading: false })
            })
    }

    render() {
        const { datas, mongol_data, update_time, mongol_zuruu, geo_id, is_loading } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <Loader is_loading={is_loading} />
                        <div className="col-md-12" >
                            <Header />
                        </div>

                        <div className="col-md-3 border border-dark" style={{height: '1000px'}}>
                            <Menu
                                mongol_data={mongol_data}
                                update_time={update_time}
                                mongol_zuruu={mongol_zuruu}
                            /><br/>
                            <Countries
                                getGeoID={this.getGeoID}
                                datas={datas}
                            />
                        </div>

                        <div className="col-md-9 border border-dark">
                            <div className="row">
                                <div className="col-md-12 border border-bottom border-dark" style={{height: '50px'}}>
                                    <Navbar />
                                </div>
                                <div className="col-md-12 p-0" style={{height: '950px', overflow: "auto"}}>
                                    <Switch>
                                        <Route exact path={"/covid_dashboard/graph/"} component={(props) => <Graph {...props} geo_id={geo_id}/>  } />
                                    </Switch>
                                    <Switch>
                                        <Route path={"/covid_dashboard/"} component={(props) => <CovidMap {...props} geo_id={geo_id}/>  } />
                                    </Switch>
                                    <Switch>
                                        <Route exact path="/covid_dashboard/vaccine/" component={Vaccine} />
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
