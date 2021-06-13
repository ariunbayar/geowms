import React, { Component } from "react";
import InspireMap from "@utils/BundleMap"
import {LLCPP} from './llc_popup'

export class LLCMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            vector_datas: props.vector_datas
        }
    }

    componentDidUpdate(pP, pS) {
        const {vector_datas} = this.props
        if(pP.vector_datas != vector_datas) {
            this.setState({vector_datas})
        }
    }

    render() {
        const { vector_datas } = this.state
        const {height, aimag_geom} = this.props
        return (
            <div className="col-12 col-md-12 col-xl-12">
                <InspireMap
                    height={height}
                    is_menu_bar_all='close'
                    vector_source={vector_datas}
                    PPContent={this.props.PPContent}
                    featurefromUrl={true}
                    property_pp={true}
                    PPContent={this.props.PPComponent ?  this.props.PPComponent : LLCPP}
                    aimag_geom={aimag_geom}
                />
            </div>
        );
    }
}
