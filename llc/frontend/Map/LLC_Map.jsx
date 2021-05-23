import React, { Component } from "react";
import InspireMap from "@utils/BundleMap"
import { PopUp } from "./llc_popup"


export class LLCMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="col-12 col-md-12 col-xl-12">
                <div className="card">
                    <div className="card-body">
                        <InspireMap
                            height='100vh'
                            is_menu_bar_all='close'
                            PPContent={PopUp}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
