import React, { Component } from "react"
import Modal from "../../../src/components/Modal/DeleteModal"

export default class DataTable extends Component {

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

    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) this.props.handleSaveSuccess
        })
    }

    render() {
        const {is_modal_delete_open}=this.state
        const { rows, fields } = this.props.data

        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr>
                        { fields.map((field, idx) =>
                            <th key={ idx }>
                                { field }
                            </th>
                        )}
                            <th></th>
                    </tr>
                </thead>
                <tbody>

                    { rows.map((row, idx) =>

                        <tr key={ idx }>

                            { fields.map((field, idx) =>

                                <td key={ idx }>
                                    { row[field] }
                                </td>

                            )}
                            <td>
                                <a href="#" onClick={this.handleModalDeleteOpen}>
                                    <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                                </a>

                                {is_modal_delete_open &&
                                    <Modal
                                        modalClose={this.handleModalDeleteClose}
                                        modalAction={() => this.handleRemove(row.id)}
                                        text={`Та "${row.id}" id-тай мэдээллийг устгахдаа итгэлтэй байна уу?`}
                                        title="Тохиргоог устгах"
                                    />
                                }
                            </td>

                        </tr>

                    )}
                </tbody>
            </table>
        )
    }
}
