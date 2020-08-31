import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../Modal"

export class OrgFormTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            is_modal_delete_open: false,
        }
        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
    }

    handleModalDeleteOpen() {
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
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
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                    {is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleUserDelete}
                            text={`Та "${org.name}" нэртэй байгууллагыг устгахдаа итгэлтэй байна уу?`}
                            title="Байгууллага устгах"
                        />
                    }
                </td>
            </tr>
        )

    }

}