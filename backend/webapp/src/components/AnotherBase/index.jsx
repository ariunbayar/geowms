import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import ConfigTitles from './ConfigTitles'
import MSSQL from './MSSQL'
import MONGO from './MONGO'
import List from './List'

class index extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="">
                <Switch>
                    <Route path={"/back/another-base/connection/mongo/"} component={MONGO}/>
                    <Route path={"/back/another-base/connection/mssql/"} component={MSSQL}/>
                    <Route path={"/back/another-base/connection/"} component={ConfigTitles}/>
                    <Route exact path={"/back/another-base/"} component={List}/>
                </Switch>
            </div>
        );
    }
}

export default index;