import React, { PureComponent } from 'react';
import { Switch, Route } from "react-router-dom"
import Form from './Form'
import {service} from './service'

class CovidDashboardConfig extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
        this.getDashboard = this.getDashboard.bind(this)
    }

    componentDidMount() {
        console.log('mount');
        this.getDashboard()
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

    render() {
        const { covid_dashboard } = this.props
        return (
            <div className="card">
                <Switch>
                    <Route exact
                        path="/gov/covid-dashboard-config/"
                        component={(props) =>
                            <Form
                                {...props}
                                covid_dashboard={covid_dashboard}
                                data={this.state.data}
                            />
                        }
                    />
                </Switch>
            </div>
        );
    }
}

export default CovidDashboardConfig;
