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
        const { id, objectid, point_id, point_name, pid, point_class, point_type, center_typ,aimag, sum, t_type, sheet1, sheet2, sheet3, geom} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <th>{idx + 1}</th>
                <th>{objectid}</th>
                <th>{point_name}</th>
                <th>{pid}</th>
                <th>{point_class}</th>
                <th>{point_type}</th>
                <th>{center_typ}</th>
                <th>{aimag}</th>
                <th>{sum}</th>
                <th>{t_type}</th>
                <th>
                    <NavLink to={`/back/froms/tseg-personal/${id}/засах/`}>
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
