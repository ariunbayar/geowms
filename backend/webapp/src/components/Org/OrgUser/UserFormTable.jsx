import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from '../../Modal'


export class UserFormTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            is_modal_delete_open: false,
        }
        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
    }
    componentDidMount(){
    }
    handleModalDeleteOpen() {
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }
    render() {
        const org_id = this.props.org_id
        const idx = this.props.idx
        const org_level = this.props.org_level
        const employee = this.props.values
        const is_modal_delete_open=this.state.is_modal_delete_open
        return (
            <tr>
                <td>{idx}</td>
                <td>{employee.last_name + ". " + employee.first_name}</td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>
                    {
                        employee.is_admin ?
                        <div className="text-center">
                            <i className="fa fa-check-circle-o text-success fa-lg" aria-hidden="true"></i>
                        </div>
                        :
                        null
                    }
                </td>
                <td>{employee.created_at}</td>
                <td>{employee.updated_at}</td>
                <td>
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${employee.id}/засах/`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    {is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleGovorgDelete}
                            text={`Та "${employee.first_name}" нэртэй хэрэглэгчийг устгахдаа итгэлтэй байна уу?`}
                            title="Хэрэглэгч устгах"
                            model_type_icon = "success"
                        />
                    }
                </td>
            </tr>
        )
    }

}
