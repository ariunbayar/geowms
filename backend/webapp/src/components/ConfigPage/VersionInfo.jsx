
import React, { Component, version } from "react"
import {NavLink} from "react-router-dom"

import {service} from './service'


export default class VersionInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            postgreVersion: '',
            versionOfPostGis: '',
            geoserverVersion: []
        }
    }

    componentDidMount() {
        service.getPostgeVersion().then(({postgreVersion, versionOfPostGis, geoserverVersion}) => {
            this.setState({postgreVersion, versionOfPostGis, geoserverVersion:geoserverVersion['about']['resource']})
        })
    }

    render() {

        const {postgreVersion, versionOfPostGis, geoserverVersion} = this.state
        console.log()
        return (
            <div className="card flex-grow-1">

                <div className="card-header">
                    Системийн хувилбар
                </div>

                <div className="card-body">

                    <h4>PostgreSQL хувилбар</h4>
                    <p>{postgreVersion}</p>

                    <h4>PostGIS хувилбар</h4>
                    <p>{versionOfPostGis}</p>

                    <h4>Geoserver хувилбар</h4>
                    <ul>
                        {geoserverVersion.length > 0 ? 
                        <p>
                            Version:{geoserverVersion[0]['Version']} &nbsp;
                            Build-Timestamp:{geoserverVersion[0]['Build-Timestamp']}
                           
                        </p>                        
                        :''}
                    </ul>

                </div>

            </div>
        )
    }
}
