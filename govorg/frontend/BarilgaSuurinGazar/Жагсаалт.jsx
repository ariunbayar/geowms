import React, { Component } from "react"

import Modal from "../../../src/components/Modal/DeleteModal"
import { service } from "./service"
import { NavLink } from "react-router-dom"

export default class Жагсаалт extends Component {

    constructor(props) {

        super(props)

        this.state = {

            is_loading: true,

            id: this.props.match.params.oid,
            is_modal_delete_open: false,
            data: {
                fields: [],
                rows: [],
            },

        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleUpdateData = this.handleUpdateData.bind(this)
        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)

    }

    componentDidMount() {
        this.handleUpdateData()

    }

    handleUpdateData(){
        service
            .rows(this.state.id)
            .then(({ data }) => {
                this.setState({
                    data,
                    is_loading: false,
                })
            })
    }

    handleSaveSuccess(){
        this.handleUpdateData()
    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }

    handleRemove(id) {
        const value = { 'oid': this.state.id }
        service.remove(value, id).then(({success}) => {
            if (success) {
                this.handleSaveSuccess()
                this.setState({is_modal_delete_open: false})
            }
        })
    }

    render() {

        if (this.state.is_loading) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }

        const { is_modal_delete_open } = this.state
        const { rows, fields } = this.state.data

        return (
            <div className="border border-danger" style={{overflowX: 'auto'}}>
                <table className="table table-bordered table-sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            { fields.map((field, idx) =>
                                <th key={ idx }>
                                    { field.name }
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>

                        { rows.map((row, idx) =>

                            <tr key={ idx }>

                                <td>
                                    <NavLink to={`#`}>
                                        <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                                    </NavLink>
                                </td>
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

                                { fields.map((field, idx) =>

                                    <td key={ idx }>
                                        { field.type == 'geometry'
                                            ?
                                                row[field.name].substr(0, 40)
                                            :
                                                row[field.name]
                                        }
                                    </td>

                                )}

                            </tr>

                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
