import React, { Component } from "react"
import InspireMap from "@utils/BundleMap"
import {service} from './service'
import {NemaPP} from './nemapop'
import { containsCoordinate } from "ol/extent"

export default class CovidMap extends Component {

    constructor(props) {

        super(props)

        this.state = {
            geo_id: props.geo_id ? props.geo_id : '496',
            geo_data: [],
            form_datas: [],
            center_of_geom: []
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
            .then(({ geo_data, form_datas, center_of_geom}) => {
                this.setState({geo_data, form_datas, center_of_geom})
            })
    }

    render() {
        const { geo_data, form_datas, center_of_geom} = this.state
        const { wms_list } = this.props
        return (
            <div className="col p-0">
                <InspireMap
                    height="80vh"
                    vector_source={geo_data}
                    PPContent={NemaPP}
                    wms_list={wms_list || []}
                    is_search_bar={true}
                />
            </div>
        )
    }
}
