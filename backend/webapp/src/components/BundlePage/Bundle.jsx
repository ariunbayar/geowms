import React, { Component } from "react"
import "./styles.css";


import Modal from "../Modal"
export default class Bundle extends Component {
    constructor(props) {
        super(props)

        this.state = {
            is_modal_delete_open: false,
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)

    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }
    render() {
        const {id, name, price, icon_url, wms_list} = this.props.values
        const {is_modal_delete_open}=this.state
        return (
            <tr>

                <th scope="col">
                    {id}
                </th>

                <td>
                    <img className="img" src={icon_url}/>
                    {name}
                </td>

                <td>
                    <ul>
                        {wms_list.map((wms_name, idx) =>
                            <li key={idx}>{wms_name}</li>
                        )}
                    </ul>
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

                    {is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                        />
                    }
                </td>
                <td>
                    <a href="#" onClick={event => this.props.handleMove(event, id, 'up')}>
                        <i className="fa fa-chevron-up" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <a href="#" onClick={event => this.props.handleMove(event, id, 'down')}>
                        <i className="fa fa-chevron-down" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )
    }
}