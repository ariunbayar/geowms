import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import Modal from "@utils/Modal/Modal"


export default class FormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: 'closed'
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    render() {
        const { id, dugaar, date, inspireid, too_shirheg, aimagname, sumname, burtgegch, created_at} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <th>{idx + 1}</th>
                <th>{dugaar}</th>
                <th>{aimagname}</th>
                <th>{sumname}</th>
                <th>{too_shirheg}</th>
                <th>{burtgegch}</th>
                <th>{created_at}</th>
                <th>
                    <NavLink to={`/gov/tuuhen-ov/${id}/add/`}>
                            <i className="fa fa-plus-circle gp-text-primary" aria-hidden="true"></i>
                    </NavLink>
                </th>
                <th>
                    <NavLink to={`/gov/tuuhen-ov/${id}/update/`}>
                            <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                    </NavLink>
                </th>
                <th>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    <Modal
                        modal_status={this.state.modal_status}
                        modal_icon='fa fa-exclamation-circle'
                        icon_color='warning'
                        title='Тохиргоог устгах'
                        has_button={true}
                        text={`Та "${dugaar}" бүртгэлийн дугаарыг устгахдаа итгэлтэй байна уу?`}
                        modalAction={this.props.handleRemove}
                        actionNameDelete="Устгах"
                    />
                </th>
            </tr>
        )
    }
}
