import React, { Component } from "react"



export class AccessFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {username, ip_address, browser_name, browser_version, device_name, created_at} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <td>{idx}</td>
                <td>{username}</td>
                <td>{ip_address}</td>
                <td>{browser_name}</td>
                <td>{browser_version}</td>
                <td>{device_name}</td>
                <td>{created_at}</td>
            </tr>
        )
    }

}
