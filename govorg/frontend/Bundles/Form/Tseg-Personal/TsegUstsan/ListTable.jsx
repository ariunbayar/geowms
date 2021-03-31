import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import Modal from "@utils/Modal/Modal"


export default class ListTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_modal_delete_open: false,
            is_modal_success_open: false,
            point_role_list: props.point_role_list
        }

        this.handleModalSuccessOpen = this.handleModalSuccessOpen.bind(this)
        this.handleModalSuccessClose = this.handleModalSuccessClose.bind(this)
        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)

    }

    handleModalSuccessOpen(event) {
        event.preventDefault()
        this.setState({is_modal_success_open: true})
    }

    handleModalSuccessClose() {
        this.setState({is_modal_success_open: false})
    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }

    render() {
        const idx = this.props.idx
        const {id,email,name,alban_tushaal,utas,tseg_id, is_removed} = this.props.values
        const {is_modal_success_open, is_modal_delete_open, point_role_list} = this.state
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
                        (point_role_list && point_role_list.PERM_UPDATE) &&
                        !is_removed
                        &&
                            <NavLink to={`/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/${id}/засах`}>
                                <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                            </NavLink>
                    }
                </td>
                <td>
                    {
                        (point_role_list && point_role_list.PERM_REVOKE) &&
                        <button href="#" className={`btn ${!is_removed ? ' gp-btn-primary' : "btn-success"}`} disabled={is_removed ? 'disabled': ''} aria-hidden="true" onClick={this.handleModalSuccessOpen}>
                        {
                            is_removed
                            ?
                                'Баталгаажсан'
                            :
                                'Баталгаажуулах'
                        }
                    </button>
                    }
                    {is_modal_success_open &&
                        <Modal
                            modalClose={this.handleModalSuccessClose}
                            modalAction={this.props.handleTsegSuccess}
                            text={`Та "${tseg_id}" цэгийг устгахдаа итгэлтэй байна уу?`}
                            title="Баталгаажуулах уу?"
                            actionNameBack="    Үгүй"
                            actionNameDelete="  Тийм"
                            model_type_icon = "warning"
                        />
                    }
                </td>
                <td>
                    {
                        (point_role_list && point_role_list.PERM_REMOVE) &&
                        !is_removed
                        &&
                            <a href="#" onClick={this.handleModalDeleteOpen}>
                                <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                            </a>
                    }
                    {is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                            model_type_icon='success'
                        />
                    }
                </td>
            </tr>
        )
    }
}
