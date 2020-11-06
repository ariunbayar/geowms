import React, { Component } from "react"



export class ListTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {id, name, description, created_by, user_id} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <td>{idx}</td>
                <td>{name}</td>
                <td>{description}</td>
                <td>{created_by}</td>
            </tr>
        )
    }

}
