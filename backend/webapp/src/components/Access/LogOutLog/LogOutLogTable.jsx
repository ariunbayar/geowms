import React, { Component } from "react"



export class LogOutLogTable extends Component {

    constructor(props) {
        super(props)
    }
    
    componentDidMount(){
    }

    render() {
        const {id, username, datetime, user_id, remote_ip} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <td>{idx + 1}</td>
                <td>{username}</td>
                <td>{user_id}</td>
                <td>{remote_ip}</td>
                <td>{datetime}</td>
            </tr>
        )
    }

}
