import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"

import ConfigTitles from './ConfigTitles'
import PgDB from './PgDb/index'
import List from './List'

class DBExport extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="">
                <Switch>
                    <Route path={"/back/db-export/connection/pg/"} component={PgDB}/>
                    <Route path={"/back/db-export/connection/"} component={ConfigTitles}/>
                    <Route exact path={"/back/db-export/"} component={List}/>
                </Switch>
            </div>
        );
    }
}

export default DBExport;
