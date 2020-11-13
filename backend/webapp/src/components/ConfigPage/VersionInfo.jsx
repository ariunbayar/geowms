
import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import {service} from './service'


export default class VersionInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            postgreVersion: '',
            postGis: ''
        }
    }

    componentDidMount() {
        service.getPostgeVersion().then(({postgreVersion, versionOfPostGis}) => {
            this.setState({postgreVersion, versionOfPostGis})
        })
    }

    render() {

        const {postgreVersion, versionOfPostGis} = this.state

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

                </div>

            </div>
        )
    }
}
