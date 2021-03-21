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
        service.getState(geo_id).then(({success, count_datas, count_covid_datas, charts, name}) =>{
            if(success){
                this.setState({count_datas, count_covid_datas, charts, name})
            }
        })
    }

    render() {
        const { datas, mongol_data, update_time, mongol_zuruu, geo_id, is_loading, count_datas, count_covid_datas } = this.state

        const getData = (canvas) => {
            const ctx = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 0, 300, 0);
            gradient.addColorStop(0, '#0088CA');
            gradient.addColorStop(0.5, '#006CB6');
            gradient.addColorStop(1, '#0B3A7D');

            return {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
                datasets: [
                    {
                        label: 'Chart',
                        data: [33, 53, 85, 41, 44, 65],
                        backgroundColor: gradient,
                        borderColor: '#05deb3',
                    },

                    {
                        label: 'Chart1',
                        data: [33, 53, 85, 41, 44, 65],
                        backgroundColor: gradient,
                        borderColor: '#05deb3',
                    },

                    {
                        label: 'Chart2',
                        data: [33, 53, 85, 41, 44, 65],
                        backgroundColor: gradient,
                        borderColor: '#05deb3',
                    },
                ]
            }
        }
        const canvas = document.createElement('canvas');
        const chartData = getData(canvas);

        const data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "First dataset",
                data: [33, 53, 85, 41, 44, 65],
                fill: true,
                backgroundColor: 'rgba(52, 168, 235, 0.2)',
                borderColor: 'rgba(52, 168, 235, 1)',
                borderWidth: 1,
              },
              {
                label: "Second dataset",
                data: [33, 25, 35, 51, 54, 76],
                fill: false,
                backgroundColor: 'linear-gradient(to right, #0088CA, #0B3A7D)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
              {
                label: "Tirth dataset",
                data: [3, 15, 25, 41, 34, 66],
                fill: false,
                backgroundColor: 'rgba(52, 168, 235, 0.2)',
                borderColor: 'rgba(52, 168, 235, 1)',
                borderWidth: 1,
              },
            ]
        };

        const options = {
            cornerRadius: 10,
        }

        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <Loader is_loading={is_loading} />
                        <div className="col-md-2">
                            <Countries
                                getGeoID={this.getGeoID}
                                datas={datas}
                            />
                        </div>
                        <div className="col-10">
                            <div className="row">
                                <div className="col-12">
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
                                <div className="col-8">
                                    <CovidMap />
                                </div>
                                <div className="col-4">
                                    <div className="card bg-transparent shadow-none border border-light">
                                        <DropDown />
                                        <div className="card-body">
                                            <Bar
                                                height={200}
                                                data={chartData}
                                                options={options}
                                            />
                                        </div>
                                    </div>
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
            </div>
        );
    }
}

export default CovidDashboard;
