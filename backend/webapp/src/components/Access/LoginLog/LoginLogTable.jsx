import React, { Component } from "react"



export class LoginLogTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {id, username, datetime, user_id, remote_ip, login_type} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <td>{idx }</td>
                <td>{username}</td>
                <td>{login_type==1 ? "logout" : "login"}</td>
                <td>{user_id}</td>
                <td>{remote_ip}</td>
                <td>{datetime}</td>
            </tr>
        )
    }

}
