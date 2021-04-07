import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import Modal from "@utils/Modal/Modal"


export default class DursgaltGazarTable extends Component {

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
        const dursgalt_id = this.props.dursgalt_id
        const { id, dursgal, tuuh_soyl_id, x,y, stone, protection, created_at, point_check} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <th>{idx}</th>
                <th>{dursgal}</th>
                <th>{stone}</th>
                <th>{x}</th>
                <th>{y}</th>
                <th>
                    {point_check ?
                        <a className="text-success">Багтсан</a> :
                        <a className="text-danger">Багтаагүй</a>
                    }
                </th>
                <th>{created_at}</th>
                <th>
                    <NavLink to={`/gov/tuuhen-ov/dursgalt-gazar/${dursgalt_id}/update/${id}/`}>
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
                        title='Токен шинэчлэх'
                        has_button={true}
                        text={`Та "${dursgal}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                        modalAction={this.props.handleRemove}
                        actionNameDelete="Устгах"
                    />
                </th>
            </tr>
        )
    }
}
