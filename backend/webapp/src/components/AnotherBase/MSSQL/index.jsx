import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import ConnectionConfig from './ConnectionConfig'

class index extends Component {
    render() {
        return (
            <div className="card-body">
                 <Switch>
                    <Route path={"/back/another-base/mssql/"} component={ConnectionConfig}/>
                </Switch>
            </div>
        );
    }
}

export default index;