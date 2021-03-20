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
                    <div className="col-12 col-lg-7 col-xl-8">
                        <div className="card bg-transparent shadow-none border border-light">
                            <div className="card-header bg-transparent">Top Selling Country
                                <div className="card-action">
                                <div className="dropdown">
                                <a href="#" className="dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown">
                                <i className="icon-options"></i>
                                </a>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <a className="dropdown-item" href="#">Action</a>
                                        <a className="dropdown-item" href="#">Another action</a>
                                        <a className="dropdown-item" href="#">Something else here</a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="#">Separated link</a>
                                    </div>
                                </div>
                                </div>
                                </div>
                            <div className="card-body">
                                <div className="row">
                                <div className="col-lg-7 col-xl-8 border-right">
                                </div>
                                <div className="col-lg-5 col-xl-4">

                                    <p><i className="flag-icon flag-icon-us mr-1"></i> USA <span className="float-right">70%</span></p>
                                    <div className="progress" >
                                        <div className="progress-bar bg-primary progress-bar-striped" role="progressbar"></div>
                                    </div>

                                    <p className="mt-3"><i className="flag-icon flag-icon-ca mr-1"></i> Canada <span className="float-right">65%</span></p>
                                    <div className="progress" >
                                        <div className="progress-bar bg-danger progress-bar-striped" role="progressbar"></div>
                                    </div>

                                    <p className="mt-3"><i className="flag-icon flag-icon-gb mr-1"></i> England <span className="float-right">60%</span></p>
                                    <div className="progress" >
                                        <div className="progress-bar bg-success progress-bar-striped" role="progressbar"></div>
                                        </div>

                                    <p className="mt-3"><i className="flag-icon flag-icon-au mr-1"></i> Australia <span className="float-right">55%</span></p>
                                    <div className="progress" >
                                        <div className="progress-bar bg-warning progress-bar-striped" role="progressbar"></div>
                                        </div>

                                    <p className="mt-3"><i className="flag-icon flag-icon-in mr-1"></i> India <span className="float-right">50%</span></p>
                                    <div className="progress" >
                                        <div className="progress-bar bg-info progress-bar-striped" role="progressbar"></div>
                                        </div>

                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-5 col-xl-4">
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
                    <div className="row">
                        <div className="col-12 col-lg-4 col-xl-4">
                            <div className="card bg-transparent shadow-none border border-light">
                            <div className="card-header bg-transparent border-light">
                                Top Selling Categories
                            <div className="card-action">
                            <div className="dropdown">
                            <a href="#" className="dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown">
                                <i className="icon-options"></i>
                            </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Separated link</a>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="card-body">
                                <div className="chart-container-2">
                                    <div className="chartjs-size-monitor" style={{ position: "absolute", inset: "0px", overflow: "hidden", pointerEvents: "none", visibility: "hidden", zIndex: "-1" }}>
                                        {/* <div className="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"> */}
                                        <div className="chartjs-size-monitor-expand">
                                            {/* <div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"> */}
                                            <div style={{ position: "absolute", width: "1000000px", height: "1000000px", left: 0, top: 0 }}>
                                            </div>
                                        </div>
                                        <div className="chartjs-size-monitor-shrink">
                                            {/* <div style="position:absolute;width:200%;height:200%;left:0; top:0"> */}
                                            <div style={{ position: "absolute", width: "200%", height: "200%", left: 0, top: 0 }}>
                                            </div>
                                        </div>
                                        </div>
                                <canvas id="dashboard2-chart-5" width="247" height="260" className="chartjs-render-monitor" style={{ display: "block", width:"247px", height: "260px" }}></canvas>
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
