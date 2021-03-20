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
                        <div className="col-12 col-lg-7 col-xl-2 border border-primary">
                            <Countries
                                getGeoID={this.getGeoID}
                                datas={datas}
                            />
                        </div>
                        <div className="col-12 col-lg-7 col-xl-10">
                            <div className="row">
                                <div className="col-12 col-lg-7 col-xl-10 border border-primary">
                                    <div className="card bg-transparent shadow-none border border-light">
                                        <div className="card-body">
                                            <div className="row">
                                                <CovidMap />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-7 col-xl-2 border border-primary">
                                    <div className="card bg-transparent shadow-none border border-light">
                                        <div className="card-body">
                                        <div className="media align-items-center">
                                        <div className="media-body text-left">
                                            <h4 className="text-primary mb-0">45,85,240</h4>
                                            <span>Total Likes</span>
                                        </div>
                                        <div className="align-self-center w-circle-icon rounded gradient-violet">
                                            <i className="icon-like text-white"></i></div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="card bg-transparent shadow-none border border-light">
                                        <div className="card-body">
                                        <div className="media align-items-center">
                                        <div className="media-body text-left">
                                            <h4 className="text-danger mb-0">78,50,325</h4>
                                            <span>Comments</span>
                                        </div>
                                        <div className="align-self-center w-circle-icon rounded gradient-ibiza">
                                            <i className="icon-speech text-white"></i></div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="card bg-transparent shadow-none border border-light">
                                        <div className="card-body">
                                        <div className="media align-items-center">
                                        <div className="media-body text-left">
                                            <h4 className="text-dark mb-0">25,40,354</h4>
                                            <span>Total Shares</span>
                                        </div>
                                        <div className="align-self-center w-circle-icon rounded gradient-royal">
                                            <i className="icon-share text-white"></i></div>
                                        </div>
                                        </div>

                                    </div>
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
