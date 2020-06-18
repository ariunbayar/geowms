import React, { Component, Fragment } from "react"

import WMSItem from './WMSItem'


export class Sidebar extends Component {

    render() {
        return (
            <form>
                {this.props.map_wms_list.map((wms, idx) =>
                    <WMSItem wms={wms} key={idx}/>
                )}
            </form>
        )
    }
}
