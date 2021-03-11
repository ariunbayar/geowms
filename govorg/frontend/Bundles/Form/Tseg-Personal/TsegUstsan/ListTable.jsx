import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import Modal from "@utils/Modal/Modal"


export default class ListTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: 'closed',
        }

        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)

    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, icon_color, title, text, has_button, modalAction, actionNameDelete, actionNameBack) {
        this.setState({
            modal_icon,
            icon_color,
            title,
            text,
            has_button,
            modalAction,
            actionNameDelete,
            actionNameBack
        })
        this.handleModalOpen()
    }

    render() {
        const idx = this.props.idx
        const {id,email,name,alban_tushaal,utas,tseg_id} = this.props.values
        return (
            <tr>
                <td scope="col">
                    {idx+1}
                </td>
                <td scope="col">
                    {email}
                </td>
                <td>
                   {name}
                </td>
                <td>
                    {alban_tushaal}
                </td>
                <td>
                    {tseg_id}
                </td>
                {
                    // perm_view && perm_create && perm_remove
                    // ?
                        <td>
                            <NavLink to={`/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/${id}/засах`}>
                                <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                            </NavLink>
                        </td>
                    // :
                    // null
                }
                {
                    // perm_approve
                    // ?
                        <td>
                            <button
                                href="#"
                                className="btn gp-btn-primary"
                                aria-hidden="true"
                                onClick={()  => this.modalChange(
                                    'fa fa-exclamation-circle',
                                    "warning",
                                    'Тохиргоог устгах',
                                    `Та "${name}" цэгийг баталгаажуулахдаа итгэлтэй байна уу?`,
                                    true,
                                    this.props.handleTsegSuccess,
                                    'Тийм',
                                    'Үгүй'
                                )}
                            >
                                Баталгаажуулах
                            </button>
                        </td>
                    // : null
                }
                <td>
                    <a href="#"
                        onClick={() => this.modalChange(
                            'fa fa-exclamation-circle',
                            "warning",
                            'Тохиргоог устгах',
                            `Та "${name}" нэртэй цэгийг устгахдаа итгэлтэй байна уу?`,
                            true,
                            this.props.handleRemove,
                            'Тийм',
                            'Үгүй'
                        )}
                    >
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    <Modal
                        modal_status={this.state.modal_status}
                        modal_icon={this.state.modal_icon}
                        icon_color={this.state.icon_color}
                        title={this.state.title}
                        has_button={this.state.has_button}
                        text={this.state.text}
                        modalAction={this.state.modalAction}
                        actionNameDelete={this.state.actionNameDelete}
                        actionNameBack={this.state.actionNameBack}
                    />
                </td>
            </tr>
        )
    }
}
