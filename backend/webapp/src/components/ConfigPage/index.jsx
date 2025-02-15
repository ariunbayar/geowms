import React, { Component, Fragment } from 'react'
import {Switch, Route,  NavLink} from 'react-router-dom'

import DiskSize from './DiskSize'
import VersionInfo from './VersionInfo'
import ConfigGeoserver from './ConfigGeoserver'
import ConfigSite from './ConfigSite'
import ConfigSystem from './ConfigSystem'
import ConfigEmail from './ConfigEmail'
import ConfigQgis from './ConfigQgis'
import ConfigDan from './ConfigDan'
import ConfigPayment from './ConfigPayment'
import ConfigQpay from './ConfigQpay'
import ConfigValueTypes from './ConfigInspireValueTypes'
import ConfigQgisPlugin from './ConfigQgisPlugin'

export default class ConfigPage extends Component {

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
                        <ConfigQgis/>
                        <ConfigSystem/>
                        <ConfigGeoserver/>
                    </div>
                    <div className="col-lg-4">
                        <ConfigDan/>
                        <ConfigQpay/>
                    </div>
                    <div className="col-lg-4">
                        {/* <ConfigValueTypes/> */}
                        <ConfigEmail/>
                        <ConfigPayment/>
                        <ConfigQgisPlugin/>
                    </div>
                </div>
            </div>
        )
    }

}
