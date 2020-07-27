import React, { Component } from "react"
import Modal from "@/components/Modal"

export default class WMS extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: 'closed',
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)

    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({modal_status: 'open'})
    }

    render() {

        const {id, name, url, public_url, created_at} = this.props.values

        return (
            <tr>
                <th>
                    {id}
                </th>
                <td>
                    {name}
                </td>
                <td>
                    {url}
                </td>
                <td>
                    {public_url}
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    <a href="#" onClick={this.props.handleEdit}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                    <Modal
                        modalAction={this.props.handleRemove}
                        text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                        title="Тохиргоог устгах"
                        status={this.state.modal_status}
                    />
                </td>
            </tr>
        )
    }
}
