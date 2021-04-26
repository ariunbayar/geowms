import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

// import ConfigTitles from '../AnotherBase/ConfigTitles'
// import MSSQL from '../AnotherBase/MSSQL'
// import MONGO from '../AnotherBase/MONGO'
import List from './List'

class DBExport extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="">
                <Switch>
                    {/* <Route path={"/back/another-base/connection/crontab/:id/"} component={CronTab}/> */}
                    {/* <Route path={"/back/another-base/connection/mongo/"} component={MONGO}/> */}
                    {/* <Route path={"/back/another-base/connection/mssql/"} component={MSSQL}/> */}
                    {/* <Route path={"/back/another-base/connection/"} component={ConfigTitles}/> */}
                    <Route exact path={"/back/db-export/"} component={List}/>
                </Switch>
            </div>
        );
    }
}

export default DBExport;
