import React, { Component, Fragment } from 'react'
import {Switch, Route,  NavLink} from 'react-router-dom'

import DiskSize from './DiskSize'
import VersionInfo from './VersionInfo'
import ConfigGeoserver from './ConfigGeoserver'
import ConfigSite from './ConfigSite'
import ConfigSystem from './ConfigSystem'
import ConfigEmail from './ConfigEmail'


export class ConfigPage extends Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-8 d-flex">
                        <ConfigSite/>
                    </div>
                    <div className="col-lg-4 d-flex flex-column">
                        <DiskSize/>
                        <VersionInfo/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <ConfigGeoserver/>
                        <ConfigSystem/>
                    </div>
                    <div className="col-lg-4">
                        <ConfigEmail/>
                    </div>
                </div>
            </div>
        )
    }

}
