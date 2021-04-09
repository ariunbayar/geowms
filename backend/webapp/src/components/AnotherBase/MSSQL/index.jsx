import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import ConnectionConfig from './ConnectionConfig'
import MssqlForm from './Form/MssqlForm'
import MssqlList from './Home/Datatable'

class index extends Component {
    render() {
        return (
            <div className="card-body">
                 <Switch>
                    <Route path={"/back/another-base/connection/mssql/:id/:table_id/update/"} component={MssqlForm}/>
                    <Route path={"/back/another-base/connection/mssql/:id/create/"} component={MssqlForm}/>
                    <Route path={"/back/another-base/connection/mssql/:id/tables/"} component={MssqlList}/>
                    <Route path={"/back/another-base/connection/mssql/:id"} component={ConnectionConfig}/>
                    <Route path={"/back/another-base/connection/mssql/"} component={ConnectionConfig}/>
                </Switch>
            </div>
        );
    }
}

export default index;