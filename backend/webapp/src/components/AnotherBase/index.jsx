import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import ConfigTitles from './ConfigTitles'
import MSSQL from './MSSQL'

class index extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <Switch>
                    <Route path={"/back/another-base/mssql/"} component={MSSQL}/>
                    <Route exact path={"/back/another-base/"} component={ConfigTitles}/>
                </Switch>
            </div>
        );
    }
}

export default index;