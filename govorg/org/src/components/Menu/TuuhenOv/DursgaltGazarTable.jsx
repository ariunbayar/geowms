import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../helpers/Modal"

export default class DursgaltGazarTable extends Component {

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
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }
    componentDidUpdate(prevProps){
        if(prevProps.values !== this.props.values) this.setState({is_modal_delete_open: false})

    }

    render() {
        const dursgalt_id = this.props.dursgalt_id

        const { id, dursgal, tuuh_soyl_id, x,y, stone, protection, created_at, point_check} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <th>{idx + 1}</th>
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
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </th>
                <th>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                    {this.state.is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та "${dursgal}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                        />
                    }
                </th>
            </tr>
        )
    }
}
