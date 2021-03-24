import React, { PureComponent } from 'react';
import { Bar, Line } from "react-chartjs-2";
import Navbar from "./components/Navbar"
import {Menu} from "./components/Menu"
import {Countries} from "./components/Countries"
import Graph from "./components/Graph"
import {Header} from "./components/Header"

import {service} from './components/service'
import CovidMap from './components/covid_map'
import Vaccine from './components/vaccine'
import Loader from '@utils/Loader'
import { number } from 'yup';
import DropDown from './components/DropDown';
import Card from './components/components/Card'
import './components/components/card.css'

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
            count_covid_datas: [],
            geo_id: props.geo_id ? props.geo_id : '496',

            pop_data: [],
        }
        this.getGeoID = this.getGeoID.bind(this)
        this.getState = this.getState.bind(this)
    }

    componentDidMount() {
        this.getData()
        const {geo_id} = this.state
        this.getState(geo_id)
    }

    componentDidUpdate(pP, pS) {
        if (pS.geo_id !== this.state.geo_id) {
            this.getState(this.state.geo_id)
        }
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
        service.getState(geo_id).then(({success, count_datas, count_covid_datas, charts, name, pop_data}) =>{
            if(success){
                this.setState({count_datas, count_covid_datas, charts, name, pop_data})
            }
        })
    }

    render() {
        const { datas, mongol_data, update_time, mongol_zuruu, geo_id, is_loading, count_datas, count_covid_datas, pop_data } = this.state
        const { NemaPP, wms_list, is_search_bar, is_zoom, org_geo_id } = this.props

        return (
            <div className="card-body bg-light">
                <div className="row">
                    <Loader is_loading={is_loading} />
                    <div className="col-sm-2">
                        <Countries
                            getGeoID={this.getGeoID}
                            datas={datas}
                        />
                    </div>
                    <div className="col-sm-10">
                        <div className="row">
                            <div className="col-sm-12">
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
                        <div className="row">
                            <div className="col-sm-8">
                                <CovidMap
                                    geo_id={geo_id}
                                    datas={datas}
                                    NemaPP={NemaPP}
                                    wms_list={wms_list}
                                    is_search_bar={is_search_bar}
                                    is_zoom={is_zoom}
                                />
                            </div>
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="text-center">Насны ангилал</h4>
                                        <Bar
                                            height={200}
                                            data={pop_data}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Graph geo_id={geo_id}/>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-sm-12">
                                <div className="row">
                                {count_covid_datas.map((data, idx) =>
                                    <Card
                                        idx={idx}
                                        color={data.color}
                                        head_text={data.name}
                                        body_text={data.data}
                                        prev_data={data.prev_data}
                                    />
                                )}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CovidDashboard;
