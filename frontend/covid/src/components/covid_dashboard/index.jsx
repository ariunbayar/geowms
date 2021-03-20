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
import Card from './components/components/Card'


class CovidDashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            mongol_data: [],
            update_time: '',
            mongol_zuruu: [],
            geo_id: '',
            is_loading: true,
            count_datas: [],
            geo_id: props.geo_id ? props.geo_id : 'au_496',
        }
        this.getGeoID = this.getGeoID.bind(this)
        this.getState = this.getState.bind(this)
    }

    componentDidMount() {
        this.getData()
        const {geo_id} = this.state
        this.getState(geo_id)
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

    getState(geo_id){
        service.getState(geo_id).then(({success, count_datas, charts, name}) =>{
            if(success){
                this.setState({count_datas, charts, name})
            }
        })
    }

    render() {
        const { datas, mongol_data, update_time, mongol_zuruu, geo_id, is_loading, count_datas } = this.state
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
                                <div className="col-12 col-lg-7 col-xl-8 border border-primary">
                                    <div className="card bg-transparent shadow-none border border-light">
                                        <div className="card-body">
                                            <div className="row">
                                                <CovidMap />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-7 col-xl-4 border border-primary pt-2">
                                    <div className="row">
                                        {count_datas.map((data, idx) =>
                                            <Card
                                                idx={idx}
                                                color={data.color}
                                                head_text={data.name}
                                                body_text={data.data}
                                                prev_data={data.prev_data}
                                            />
                                        )}
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
