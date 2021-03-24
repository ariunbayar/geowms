import React, { PureComponent } from 'react';
import { Switch, Route, NavLink } from "react-router-dom"

import Header from './Header'
import Form from './Form'
import Log from './DashboardLog'
import { service } from './service'


class CovidDashboardConfig extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            covid_dashboard: props.covid_dashboard,
        }
        this.getGeom = this.getGeom.bind(this)
    }

    getGeom(geo_id, data) {
        this.setState({ geo_id, data })
    }

    render() {
        const { covid_dashboard, geo_id } = this.state
        return (
            <div className="card">
                <div className="card-body pb-0">
                    <Header
                        getGeom={this.getGeom}
                    />
                </div>
                <hr />
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
