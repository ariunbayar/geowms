import React, { Component } from "react";
import InspireMap from "@utils/BundleMap"
import { service } from "./service"
// import { PopUp } from "./llc_popup"


export class LLCMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            vector_datas: []
        }
        this.getAllGeoJson = this.getAllGeoJson.bind(this)
    }
    componentDidMount() {
        this.getAllGeoJson()
    }

    getAllGeoJson() {
        service.getAllGeoJson().then(({geo_json_datas}) =>{
            this.setState({vector_datas: geo_json_datas})
        })
    }

    render() {
        const { vector_datas } = this.state
        return (
            <div className="col-12 col-md-12 col-xl-12">
                <div className="card">
                    <div className="card-body">
                        <InspireMap
                            height='100vh'
                            is_menu_bar_all='close'
                            vector_source={vector_datas}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
