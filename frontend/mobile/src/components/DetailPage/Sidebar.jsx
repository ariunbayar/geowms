import React, { Component, Fragment } from "react"
import "./styles.css";

import WMSItem from './WMSItem'


export class Sidebar extends Component {

    render() {
        return (
            <div className="row">
                <div className="row xButtonLayer">
                    <a onClick={() => this.props.toggleSidebar(false)}>X</a>
                </div>
                <div className="row">
                    {this.props.map_wms_list.map((wms, idx) =>
                        <WMSItem wms={wms} key={idx}/>
                    )}
                </div>
            </div>
        )
    }
}
