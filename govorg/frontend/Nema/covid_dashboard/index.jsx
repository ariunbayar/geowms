import React, { PureComponent } from 'react';
import {Countries} from "./components/Countries"
import Graph from "./components/Graph"
import {service} from './components/service'
import CovidMap from './components/covid_map'
import Loader from '@utils/Loader'
import Card from '@utils/Covid/components/Card'
import '@utils/Covid/components/card.css'

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
        const { datas, mongol_data, update_time, mongol_zuruu, geo_id, is_loading, count_datas, count_covid_datas } = this.state
        return (
            <div className="card-body bg-light">
                <Loader is_loading={is_loading} />
                <div className="row">
                    <div className="col-xl-12 col-sm-12">
                        <div className="row">
                            <div className="col-10 col-sm-12 col-xl-10">
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
                            <div className="col-2 col-sm-12 col-xl-2">
                                <Countries
                                    getGeoID={this.getGeoID}
                                    datas={datas}
                                    geo_id={geo_id}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-12 col-sm-12">
                                <CovidMap
                                    geo_id={geo_id}
                                    datas={datas}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Graph geo_id={geo_id}/>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12">
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
