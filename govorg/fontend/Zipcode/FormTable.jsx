import React, { Component } from "react"

export default class FormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            code: '',
            name: '',
            x: '',
            y: ''
        }

    }


    render() {
        const {idx, values} = this.props
        return (
            <tr>
                <th>{idx + 1}</th>
                <th>{values[1]}</th>
                <th>{values[0]}</th>
                <th>
                    <a className="btn text-success" onClick={() => this.props.handleEdit(values[0], values[1], values[2], values[3], values[4], values[5], values[6])}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </a>
                </th>
            </tr>
        )
    }
}
