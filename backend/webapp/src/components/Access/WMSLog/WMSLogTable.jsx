import React, { Component } from 'react'

export class WMSLogTable extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount(){
    }

    render() {
        const {qs_all, qs_request, rsp_status, rsp_size, created_at, system_id, wms_id} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <td>{idx }</td>
                <td>{qs_all}</td>
                <td>{qs_request}</td>
                <td>{rsp_status}</td>
                <td>{rsp_size}</td>
                <td>{created_at}</td>
                <td>{system_id}</td>
                <td>{wms_id}</td>
            </tr>
        )
    }
}
