import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import Modal from "../components/helpers/Modal"

export default class MetaTable extends Component {

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
        this.setState({ is_modal_delete_open: true })
    }

    handleModalDeleteClose() {
        this.setState({ is_modal_delete_open: false })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.values !== this.props.values) this.setState({ is_modal_delete_open: false })

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
                    <a href="delete" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    {this.state.is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та метаг устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                            model_type_icon="success"
                        />
                    }
                </th>
            </tr>
        )
    }
}
