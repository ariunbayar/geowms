import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import Modal from "../../components/helpers/Modal"

export class EmployeeTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
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
        else if (this.state.action_type == 'remove') this.props.handleRemove()
        this.handleModalActionClose()
    }

    render() {
        const { idx, prefix } = this.props
        const { id, last_name, first_name, email, position, is_admin, role_name } = this.props.values

        const last_name_conv = last_name.charAt(0).toUpperCase()
        const firt_name_conv = first_name.charAt(0).toUpperCase() + first_name.slice(1)
        const full_name = last_name_conv + '. ' + firt_name_conv
        const {text, title, action_name, modal_status} = this.state

        return (
            <tr>
                <th>
                    {idx}
                </th>
                <td>
                <NavLink to={`${prefix}/${id}/detail/`}>
                    <strong>{full_name}</strong>
                </NavLink>
                </td>
                <td>
                    {email}
                </td>
                <td>
                    {position}
                </td>
		<td>{role_name}</td>
                <td className="text-center">
                    <i className={`fa ` +
                        (is_admin
                            ? `fa-check-circle-o text-success`
                            : `fa-times-circle-o text-danger`
                        ) +
                            ` fa-lg`
                        }
                        aria-hidden="true"
                    ></i>
                </td>
                <td>
                    <a role="button" className="text-center"
                        onClick={() =>
                            this.handleModalActionOpen(
                                'refresh_token',
                                `Та "${first_name}" нэртэй хэрэглэгчийн токенийг шинэчлэхдээ итгэлтэй байна уу?`,
                                "Тохиргоог шинэчлэх",
                                "ШИНЭЧЛЭХ"
                            )
                        }
                    >
                        <i className="fa fa-refresh text-primary" aria-hidden="true"></i>
                    </a>
                </td>
                <td className="text-center">
                    <NavLink to={`${prefix}/${id}/edit/`}>
                        <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td className="text-center">
                    <a role="button" onClick={() =>
                        this.handleModalActionOpen(
                            'remove',
                            `Та "${first_name}" нэртэй хэрэглэгчийг устгахдаа итгэлтэй байна уу?`,
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
                        actionNameDelete={action_name}
                    />
                </td>
            </tr>
        )

    }

}
