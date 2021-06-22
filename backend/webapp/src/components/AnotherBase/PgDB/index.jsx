import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import PgList from './list'
import ExportCreate from './create_export'

class PgIndex extends Component {
    render() {
        return (
            <div className="card-body">
                <Switch>
                    <Route path={"/back/another-base/connection/pg/:id/list/"} component={PgList}/>
                    <Route path={"/back/another-base/connection/pg/:id/create/"} component={ExportCreate}/>
                    <Route path={"/back/another-base/connection/pg/:id/:table_id/update/"} component={ExportCreate}/>
                </Switch>
            </div>
        );
    }
}

export default PgIndex;