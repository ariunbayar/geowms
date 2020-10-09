import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import Modal from "../../../src/components/Modal/DeleteModal"
import { service } from "./service"


export default class ЖагсаалтItem extends Component {

    constructor(props) {

        super(props)

        this.state = {
            is_modal_delete_open: false,
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.handleRemove = this.handleRemove.bind(this)

    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }

    handleRemove() {
        const { oid, item } = this.props
        service
            .remove(oid, item.id)
            .then(({ success }) => {
                if (success) {
                    this.props.handleUpdate()
                    this.setState({is_modal_delete_open: false})
                }
            })
    }

    render() {

        const { is_modal_delete_open } = this.state
        const { item, fields, oid } = this.props

        return (
            <tr>
                <td>
                    <NavLink to={`/gov/дэд-бүтэц/${oid}/маягт/${item.id}/засах/`}>
                        <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={ this.handleModalDeleteOpen }>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>

                    { is_modal_delete_open &&
                        <Modal
                            modalClose={ this.handleModalDeleteClose }
                            modalAction={() => this.handleRemove()}
                            text={`Та "${item.id}" id-тай мэдээллийг устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                        />
                    }
                </td>

                { fields.map((field, idx) =>

                    <td key={ idx }>
                        { field.type == 'geometry' && typeof(item[field.name]) === 'string'
                            ?
                                item[field.name].substr(0, 80)
                            :
                                item[field.name]
                        }
                    </td>

                )}

            </tr>
        )
    }
}
