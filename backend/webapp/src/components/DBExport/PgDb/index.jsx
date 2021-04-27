import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import List from './List'
import ConnectionConfig from './Connectionconfig'
import PgForm from './CreateTable'

class PgDB extends Component {
    render() {
        return (
            <div className="card-body">
                <Switch>
                    <Route exact path={"/back/db-export/connection/pg/"} component={ConnectionConfig}/>
                    <Route exact path={"/back/db-export/connection/pg/:id/"} component={ConnectionConfig}/>
                    <Route exact path={"/back/db-export/connection/pg/:id/tables/"} component={List}/>
                    <Route exact path={"/back/db-export/connection/pg/:id/create/"} component={PgForm}/>
                    <Route path={"/back/db-export/connection/pg/:id/:table_id/update/"} component={PgForm}/>
                </Switch>
            </div>
        );
    }
}

export default PgDB;
