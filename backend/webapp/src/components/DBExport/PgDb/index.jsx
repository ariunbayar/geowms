import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import List from './List'
import ConnectionConfig from './Connectionconfig'

class PgDB extends Component {
    render() {
        return (
            <div className="card-body">
                <Switch>
                    <Route exact path={"/back/db-export/connection/pg/"} component={ConnectionConfig}/>
                </Switch>
            </div>
        );
    }
}

export default PgDB;
