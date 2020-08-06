import React, { Component } from "react"



export class PageLogTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {url, method, query_string, remote_ip, datetime, user_id} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <td>{idx}</td>
                <td>{url}</td>
                <td>{method}</td>
                <td>{remote_ip}</td>
                <td>{user_id}</td>
                <td>{datetime}</td>
            </tr>
        )
    }

}
