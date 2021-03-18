import React, { PureComponent } from 'react';
import { Switch, Route } from "react-router-dom"
import Form from './Form'

class CovidDashboardConfig extends PureComponent {
    render() {
        return (
            <div className="card">
                <Switch>
                    <Route exact path="/gov/covid-dashboard-config/" component={Form} />
                </Switch>
            </div>
        );
    }
}

export default CovidDashboardConfig;
