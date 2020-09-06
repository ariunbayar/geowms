import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from '../../Modal'
export default class ListTable extends Component {

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
        const idx = this.props.idx
        const {id,email,name,alban_tushaal,utas,tseg_id} = this.props.values
        const {is_modal_delete_open}=this.state
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
                    {utas}
                </td>
                <td>
                <NavLink to={`/back/froms/tseg-ustsan/${id}/засах`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </NavLink>
                </td>
                <td>
                <a href="#" onClick={this.handleModalDeleteOpen}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </a>
                {is_modal_delete_open &&
                    <Modal
                        modalClose={this.handleModalDeleteClose}
                        modalAction={this.props.handleTsegDelete}
                        text={`Та "${name}" устгахдаа итгэлтэй байна уу?`}
                        title="Устгах"
                    />
                }
            </td>
            </tr>
        )
    }
}
