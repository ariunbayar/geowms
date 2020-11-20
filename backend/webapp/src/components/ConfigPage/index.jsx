import React, { Component, Fragment } from 'react'
import {Switch, Route,  NavLink} from 'react-router-dom'

import DiskSize from './DiskSize'
import VersionInfo from './VersionInfo'
import ConfigGeoserver from './ConfigGeoserver'
import ConfigSite from './ConfigSite'


export class ConfigPage extends Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-8">
                        <ConfigSite/>
                    </div>
                    <div className="col-lg-4">
                        <DiskSize/>
                        <VersionInfo/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <ConfigGeoserver/>
                    </div>
                </div>
            </div>
        )
    }

}
