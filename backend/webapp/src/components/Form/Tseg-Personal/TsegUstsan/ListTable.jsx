import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from '../../.././Modal'

export default class ListTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_modal_delete_open: false,
            is_modal_success_open: false,
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
        const {id,email,name,alban_tushaal,utas,tseg_id} = this.props.values
        const {is_modal_success_open, is_modal_delete_open}=this.state
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
                <NavLink to={`/back/froms/tseg-info/tsegpersonal/tseg-ustsan/${id}/засах`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </NavLink>
                </td>
                <td>
                <button href="#" className="btn gp-btn-primary" aria-hidden="true" onClick={this.handleModalSuccessOpen}>
                    Баталгаажуулах
                </button>
                {is_modal_success_open &&
                    <Modal
                        modalClose={this.handleModalSuccessOpen}
                        modalAction={this.props.handleTsegSuccess}
                        text={`Та "${name}" цэгийг устгахдаа итгэлтэй байна уу?`}
                        title="Устгах"
                        actionName="Баталгаажуул"
                    />
                }
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
            </tr>
        )
    }
}