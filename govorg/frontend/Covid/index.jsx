import React, { PureComponent } from 'react';
import { Switch, Route } from "react-router-dom"

import {service} from './service'
import SearchSelects from './SearchSelects'
import Form from './Form'

import Loader from "@utils/Loader"

class CovidDashboardConfig extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            is_loading: true,
            name: '',
            geo_id: '',
            today: new Date().toString(),
        }
        this.getDashboard = this.getDashboard.bind(this)
        this.setValueToObj = this.setValueToObj.bind(this)
        this.makeValueJson = this.makeValueJson.bind(this)
    }

    componentDidMount() {
        this.setValueToObj('au_496')
    }

    getDashboard() {
        service
            .getDashboard()
            .then(({ success, data }) => {
                if (success) {
                    this.setState({ data })
                }
            })
    }

    makeValueJson(data) {
        const { covid_dashboard } = this.props
        data.map((item, idx) => {
            covid_dashboard.map((dash, d_idx) => {
                covid_dashboard[d_idx]['value'] = item[dash.origin_name]
            })
        })
    }

    setValueToObj(geo_id) {
        this.setState({ is_loading: true })
        service
            .getDashboardFromId(geo_id)
            .then(({ success, data }) => {
                if (success) {
                    this.makeValueJson(data)
                    this.setState({ data, name: data[0].name, geo_id: data[0].geo_id })
                }
            })
            .finally(rsp => this.setState({ is_loading: false }))
    }

    render() {
        const { covid_dashboard } = this.props
        const { is_loading, name, today, geo_id } = this.state
        return (
            <div className="card">
                <div className="card-body pb-0">
                    <SearchSelects
                        getValue={this.setValueToObj}
                    />
                    <h4>{name}</h4>
                    {/* <h6>{today}</h6> */}
                </div>
                <Loader is_loading={is_loading}/>
                <Switch>
                    <Route exact
                        path="/gov/covid-dashboard-config/"
                        component={(props) =>
                            <Form
                                {...props}
                                covid_dashboard={covid_dashboard}
                                data={this.state.data}
                                geo_id={geo_id}
                            />
                        }
                    />
                </Switch>
            </div>
        );
    }
}

export default CovidDashboardConfig;
