import React, { Component } from "react"
import InspireMap from "@utils/BundleMap"
import {service} from './service'

export default class CovidMap extends Component {




    constructor(props) {

        super(props)

        this.state = {
            geo_id: props.geo_id ? props.geo_id : 'au_11',
            geo_data: [],
        }

        this.handleGeoData = this.handleGeoData.bind(this)
    }

    componentDidMount(){

        const { geo_id } = this.state

        this.handleGeoData(geo_id)

    }

    componentDidUpdate(pP, pS){

        const { geo_id } = this.props

        if(pP.geo_id != geo_id) {

            this.handleGeoData(geo_id)

        }

    }

    handleGeoData(geo_id) {
        const id = this.props.match.params.id
        service.get_geo_data(geo_id)
            .then(({ geo_data }) => {
                this.setState({geo_data})
            })
    }
    render() {
        const { geo_data } = this.state
        return (
            <div className="col-lg-12">
                <div className="col-12 col-md-12 col-xl-12">
                    <InspireMap
                        height="100vh"
                        vector_source={geo_data}
                    />
                </div>
            </div>
        )
    }
}