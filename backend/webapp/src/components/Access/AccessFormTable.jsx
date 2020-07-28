import React, { Component } from "react"



export class AccessFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {ip_address, web, date, status, url} = this.props.values
        return (
            <tr className="odd">
                <td className="sorting_1">{ip_address}</td>
                <td>{web}</td>
                <td>{date}</td>
                <td>{status}</td>
                <td>{url}</td>
            </tr>
        )
    }

}
