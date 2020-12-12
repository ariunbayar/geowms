import React, { Component } from "react"
import MapAllowedGeom from './MapAllowedGeom'


export class OrgDetail extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { allowed_geom } = this.props

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6">
                        todo
                    </div>
                    <div className="col-6">
                        { allowed_geom &&
                            <MapAllowedGeom geom={ allowed_geom }/>
                        }
                    </div>
                </div>
            </div>
        )
    }

}
