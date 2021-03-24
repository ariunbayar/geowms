import React, { PureComponent } from 'react';
import { Switch, Route, NavLink } from "react-router-dom"

import {service} from './service'
import SearchSelects from './SearchSelects'
import Form from './Form'
import Log from './DashboardLog'

import Loader from "@utils/Loader"

class CovidDashboardConfig extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            is_loading: true,
            for_log_form: props.covid_dashboard,
            covid_dashboard: props.covid_dashboard,
            name: '',
            geo_id: '',
            today: new Date().toString(),
            link: false,
        }
        this.getDashboard = this.getDashboard.bind(this)
        this.setValueToObj = this.setValueToObj.bind(this)
        this.changeLink = this.changeLink.bind(this)
    }

    componentDidMount() {
        this.setValueToObj('496')
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

    changeLink() {
        this.setState({ link: !this.state.link })
    }

    setValueToObj(geo_id) {
        this.setState({ is_loading: true })
        service
            .getDashboardFromId(geo_id)
            .then(({ success, data }) => {
                if (success) {
                    this.setState({ data, name: data[0].name, geo_id: data[0].geo_id })
                }
            })
            .finally(rsp => this.setState({ is_loading: false }))
    }

    render() {
        const { covid_dashboard } = this.state
        const { is_loading, name, today, geo_id, for_log_form, link } = this.state
        return (
            <div className="card">
                <div className="card-body pb-0">
                    <div className="row">
                        <div className="col-md-12">
                            <SearchSelects
                                getValue={this.setValueToObj}
                            />
                        </div>
                        <div className="col-md-10">
                            <h4>{name}</h4>
                        </div>
                        <div className="col-md-2">
                            {
                                link
                                ?
                                    <NavLink to={`/gov/covid-dashboard-config/`}
                                        onClick={this.changeLink}
                                        className="btn btn-primary"
                                    >
                                        Бүртгэл
                                    </NavLink>
                                :
                                    <NavLink to={`/gov/covid-dashboard-config/log/`}
                                        onClick={this.changeLink}
                                        className="btn btn-primary"
                                        >
                                        Log
                                    </NavLink>
                            }
                        </div>
                    </div>
                </div>
                <hr />
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
                                is_log={false}
                            />
                        }
                    />
                    <Route
                        path="/gov/covid-dashboard-config/log/"
                        component={(props) =>
                            <Log
                                {...props}
                                geo_id={geo_id}
                            />
                        }
                    />
                    <Route
                        path="/gov/covid-dashboard-config/log-create/"
                        component={(props) =>
                            <Form
                                {...props}
                                covid_dashboard={covid_dashboard}
                                geo_id={geo_id}
                                is_log={true}
                            />
                        }
                    />
                </Switch>
            </div>
        );
    }
}

export default CovidDashboardConfig;
