import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import Modal from "@utils/Modal/Modal"


export default class MetaTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: 'closed'
        }

        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    handleModalOpen(event) {
        event.preventDefault()
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    render() {
        const { id, title, category, keywords, org_name, status } = this.props.values
        const { idx } = this.props
        return (
                <tr>
                    <th>
                        {idx}
                    </th>
                    <th>
                    <NavLink to={`/gov/meta/${id}/detail/`}>
                        {title}
                    </NavLink>
                    </th>
                    <th>
                        {category}
                    </th>
                    <th>
                        {keywords}
                    </th>
                    <th>
                        {org_name}
                    </th>
                    <th>
                        {status}
                    </th>
                    <th>
                        <NavLink to={`/gov/meta/${id}/edit/`}>
                            <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                        </NavLink>
                    </th>
                    <th>
                        <a href="delete" onClick={this.handleModalOpen}>
                            <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                        </a>
                    </th>
                    <Modal
                        modal_status={this.state.modal_status}
                        modal_icon='fa fa-exclamation-circle'
                        icon_color='warning'
                        title="Тохиргоог устгах"
                        has_button={true}
                        text={`Та метаг устгахдаа итгэлтэй байна уу?`}
                        modalAction={this.props.handleRemove}
                        actionNameDelete="Устгах"
                    />
                </tr>
        )
    }
}
