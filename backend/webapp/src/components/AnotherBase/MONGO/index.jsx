import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import ConnectionConfig from './ConnectionConfig'
import MssqlForm from './MssqlForm'

class index extends Component {
    render() {
        return (
            <div className="card-body">
                 <Switch>
                    <Route path={"/back/another-base/connection/mongo/:id/insert/"} component={MssqlForm}/>
                    <Route path={"/back/another-base/connection/mongo/:id"} component={ConnectionConfig}/>
                    <Route path={"/back/another-base/connection/mongo/"} component={ConnectionConfig}/>
                </Switch>
            </div>
        );
    }
}

export default index;