import React, { Component, Fragment } from 'react'
import {Switch, Route,  NavLink} from 'react-router-dom'

import DiskSize from './DiskSize'
import VersionInfo from './VersionInfo'
import ConfigGeoserver from './ConfigGeoserver'
import {ConfigList} from './ConfigList'
import {ConfigForm} from './ConfigForm'


class CardConfig extends Component {

    render() {

        return (
            <div className="card">

                <div className="card-header">
                    Сайтын тохиргоо
                </div>

                <div className="card-body">
                    <Switch>
                        <Route exact path={"/back/тохиргоо/"} component={ConfigList}/>
                        <Route exact path={"/back/тохиргоо/үүсгэх/"} component={ConfigForm}/>
                        <Route exact path={"/back/тохиргоо/:id/засах/"} component={ConfigForm}/>
                    </Switch>
                </div>

            </div>
        )

    }

}


export class ConfigPage extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-8 d-flex">
                        <CardConfig/>
                    </div>
                    <div className="col-4 d-flex flex-column">
                        <DiskSize/>
                        <VersionInfo/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <ConfigGeoserver/>
                    </div>
                </div>
            </div>
        )
    }

}
