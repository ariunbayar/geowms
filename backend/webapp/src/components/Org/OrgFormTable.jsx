import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../Modal"
import ModalAlert from "../ModalAlert"

export class OrgFormTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            is_modal_delete_open: false,
        }
        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    handleModalDeleteOpen() {
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }

    modalClose(){
        this.setState({is_modal_delete_open: false})
        this.props.modalClose()
    }

    render() {
        const org = this.props.org
        const idx = this.props.idx
        const org_level = this.props.org_level
        const is_modal_delete_open=this.state.is_modal_delete_open
        return (
            <tr>
                <td>
                    {idx}
                </td>
                <td>
                    <NavLink className="text-primary" to={`/back/байгууллага/түвшин/${org_level}/${org.id}/эрх/`}>
                        {org.name}
                    </NavLink>
                </td>
                <td>
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org.id}/засах`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o" aria-hidden="true" style={{color: "red"}}></i>
                    </a>
                    {is_modal_delete_open &&
                        <>
                            <Modal
                                modalClose={this.handleModalDeleteClose}
                                modalAction={this.props.handleUserDelete}
                                text={(
                                    <p>Та <b>"{org.name}"</b> нэртэй байгууллагыг устгахдаа итгэлтэй байна уу?</p>
                                )}
                                title="Байгууллага устгах"
                                model_type_icon = "success"
                            />
                            {
                                this.props.modal_alert_check &&
                                <ModalAlert
                                    title="Амжилттай устгалаа"
                                    model_type_icon = "success"
                                    modalClose = {this.modalClose}
                                />
                            }
                        </>
                    }
                </td>
            </tr>
        )

    }

}