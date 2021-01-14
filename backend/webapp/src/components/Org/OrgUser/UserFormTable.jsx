import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from '../../Modal'


export class UserFormTable extends Component {

    constructor(props) {
        super(props)

        this.state={
            modal_status: "closed",
            action_type: '',
            text: '',
            title: '',
            action_name: ''
        }

        this.handleModalActionOpen = this.handleModalActionOpen.bind(this)
        this.handleModalActionClose = this.handleModalActionClose.bind(this)
        this.modalAction = this.modalAction.bind(this)
    }

    handleModalActionOpen(action_type, text, title, action_name){
        this.setState({modal_status: 'open', action_type, text, title, action_name})
    }

    handleModalActionClose() {
        this.setState({modal_status: 'closed'})
    }

    modalAction(){
        if(this.state.action_type == 'refresh_token') this.props.handleTokenRefresh()
        else if (this.state.action_type == 'remove') this.props.handleGovorgDelete()
        this.handleModalActionClose()
    }


    render() {
        const org_id = this.props.org_id
        const idx = this.props.idx
        const org_level = this.props.org_level
        const employee = this.props.values
        const {text, title, action_name, modal_status} = this.state
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
                    <a role="button"
                        onClick={() =>
                            this.handleModalActionOpen(
                                'refresh_token',
                                `Та "${employee.first_name}" нэртэй хэрэглэгчийн токенийг шинэчлэхдээ итгэлтэй байна уу?`,
                                "Тохиргоог шинэчлэх",
                                "ШИНЭЧЛЭХ"
                            )
                        }
                    >
                        <i className="fa fa-refresh text-primary" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${employee.id}/засах/`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a role="button" onClick={() =>
                        this.handleModalActionOpen(
                            'remove',
                            `Та "${employee.first_name}" нэртэй хэрэглэгчийг устгахдаа итгэлтэй байна уу?`,
                            "Хэрэглэгч устгах"
                            )
                        }
                    >
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    <Modal
                        modalClose={this.handleModalActionClose}
                        modalAction={this.modalAction}
                        status={modal_status}
                        text={text}
                        title={title}
                        model_type_icon = "success"
                        actionName={action_name}
                    />
                </td>
            </tr>
        )
    }

}
