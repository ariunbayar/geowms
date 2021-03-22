import React, { Component } from "react"
import InspireMap from "@utils/BundleMap"
import {service} from './service'
import {CovidPP} from './covid_popup'

export default class CovidMap extends Component {

    constructor(props) {

        super(props)

        this.state = {
            geo_id: props.geo_id ? props.geo_id : 'au_496',
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
        const id = this.props.match.params.id
        service.get_geo_data(geo_id)
            .then(({ geo_data, form_datas}) => {
                this.setState({geo_data, form_datas})
            })
    }

    render() {
        const { geo_data, form_datas} = this.state
        return (
                <div className="col-12 col-md-12 col-xl-12 h-100 p-0">
                    <InspireMap
                        height="100vh"
                        vector_source={geo_data}
                        form_datas={form_datas}
                        PPContent={CovidPP}
                        featurefromUrl={true}
                    />
                </div>
        )
    }
}
