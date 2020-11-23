
import React, { Component, version } from "react"
import {NavLink} from "react-router-dom"

import {service} from './service'


export default class VersionInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            postgreVersion: '',
            versionOfPostGis: '',
            geoserverVersion: {},
        }
    }

    componentDidMount() {

        service.getPostgeVersion().then(({ postgreVersion, versionOfPostGis }) => {
            this.setState({
                postgreVersion,
                versionOfPostGis,
            })
        })

        service.getGeoServerVersion().then(({ geoserverVersion }) => {
            this.setState({
                geoserverVersion,
            })
        })

    }

    render() {

        const {
            postgreVersion,
            versionOfPostGis,
            geoserverVersion,
        } = this.state

        return (
            <div className="card flex-grow-1">

                <div className="card-header">
                    Системийн хувилбар
                </div>

                <div className="card-body">

                    <h4>PostgreSQL хувилбар</h4>
                    <p>{ postgreVersion }</p>

                    <h4>PostGIS хувилбар</h4>
                    <p>{ versionOfPostGis }</p>

                    <h4>Geoserver хувилбар</h4>
                    <p>
                        Version: { geoserverVersion.version }<br/>
                        Build Timestamp: { geoserverVersion.build_timestamp }<br/>
                        Git Revisioin: { geoserverVersion.git_revision }
                    </p>

                </div>

            </div>
        )
    }
}
