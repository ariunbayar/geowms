import React, { Component } from "react"
import InspireMap from "@utils/BundleMap"
import {service} from './service'

export default class CovidMap extends Component {

    constructor(props) {

        super(props)

        this.state = {
            geo_id: props.geo_id ? props.geo_id : '496',
            geo_data: [],
            form_datas: [],
        }

        this.handleGeoData = this.handleGeoData.bind(this)
    }

    componentDidMount(){
        const { geo_id } = this.state
        this.handleGeoData(geo_id)
    }

    componentDidUpdate(pP, pS){
        const { geo_id, datas} = this.props
        if(pP.geo_id != geo_id) {
            this.handleGeoData(geo_id)
        }

    }

    handleGeoData(geo_id) {
        service.get_geo_data(geo_id)
            .then(({ geo_data, form_datas}) => {
                this.setState({geo_data, form_datas})
            })
    }

    render() {
        const { geo_data, form_datas} = this.state
        return (
            <div className="col-12">
                <InspireMap
                    vector_source={geo_data}
                    form_datas={form_datas}
                />
            </div>
        )
    }
}
