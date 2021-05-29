import React, { Component } from "react";
import InspireMap from "@utils/BundleMap"

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
        const {height} = this.props
        console.log("vector_Datas", vector_datas)
        return (
            <div className="col-12 col-md-12 col-xl-12">
                <div className="card">
                    <div className="card-body">
                        <InspireMap
                            height={height}
                            is_menu_bar_all='close'
                            vector_source={vector_datas}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
