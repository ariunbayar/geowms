import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../../Modal"

export default class FormTable extends Component {

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
        const { id, dugaar, date, inspireid, too_shirheg, aimagname, sumname, burtgegch,created_at} = this.props.values
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
                    <NavLink to={`/back/froms/tuuhen-ov/${id}/add/`}>
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </NavLink>
                </th>
                <th>
                    <NavLink to={`/back/froms/tuuhen-ov/${id}/update/`}>
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
                            text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                        />
                    }
                </th>
            </tr>
        )
    }
}