import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../../Modal"

export default class Govorg extends Component {

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

        this.handleRemove = this.handleRemove.bind(this);
    }

    handleModalActionOpen(action_type, text, title, action_name){
        this.setState({modal_status: 'open', action_type, text, title, action_name})
    }

    handleModalActionClose(){
        this.setState({modal_status: 'closed'})
    }

    handleRemove(){
        const {id} = this.props.values
        service.remove(id).then(({success}) => {
            success && this.props.handleUpdated()
        })
    }

    modalClose(){
        if(this.state.action_type == 'refresh_token') this.props.handleTokenRefresh()
        else if (this.state.action_type == 'remove') this.props.handleRemove()
        this.setState({modal_status: 'closed'})
    }

    render() {
        const {id, name, token, created_at} = this.props.values
        const org_level = this.props.org_level
        const org_id = this.props.org_id
        const idx=this.props.idx
        const {text, title, action_name} = this.state
        return (
            <tr>

                <th scope="col">
                    {idx}
                </th>

                <td>
                    <NavLink  className="text-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/${id}/дэлгэрэнгүй/`}>
                        {name}
                    </NavLink>
                </td>

                <td>
                    {token}
                </td>
                <td>
                    <a role="button" onClick={() => this.handleModalActionOpen('refresh_token', `Та "${name}" нэртэй тохиргооны токен шинэчлэхдээ итгэлтэй байна уу?`, "Тохиргоог шинэчлэх", "ШИНЭЧЛЭХ")}>
                        <i class="fa fa-refresh text-primary" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/${id}/засах/`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>

                <td>
                    <a href="#" onClick={() => this.handleModalActionOpen('remove', `Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`, "Тохиргоог устгах")}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    <Modal
                        text={text}
                        title={title}
                        model_type_icon = "success"
                        status={this.state.modal_status}
                        modalClose={this.handleModalActionClose}
                        modalAction={() => this.modalClose()}
                        actionName={action_name}
                    />
                </td>
            </tr>
        )
    }
}
