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
        const {id,email,name,alban_tushaal,utas,tseg_id, is_removed} = this.props.values
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
                <td>
                    {
                        !is_removed
                        &&
                            <NavLink to={`/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/${id}/засах`}>
                                <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                            </NavLink>
                    }
                </td>
                <td>
                    <button
                        href="#"
                        className={`btn ${!is_removed ? ' gp-btn-primary' : "btn-success"}`}
                        disabled={is_removed ? 'disabled': ''}
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
                        {
                            is_removed
                            ?
                                'Баталгаажсан'
                            :
                                'Баталгаажуулах'
                        }
                    </button>
                </td>
                <td>
                    {
                        !is_removed
                        &&
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
                    }
                </td>
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
            </tr>
        )
    }
}
