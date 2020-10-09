import React, { Component } from "react"
import "./styles.css";
import Modal from "../Modal"
import {NavLink} from "react-router-dom"
import { service } from "./service";


export default class Bundle extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_modal_delete_open: false,
            oid_names:[]
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

    
    render() {
        const {id, name, price, icon_url, wms_list, oid_list, oid_table_list} = this.props.values
        const {is_modal_delete_open}=this.state
        return (
            <tr>
                <th scope="col">
                    {id}
                </th>

                <td>
                    <img className="img" src={icon_url}/>
                    {name}
                </td>

                <td>
                <div className="col-md-12">
                    {wms_list.map((wms, idx) =>
                        (wms.is_active ?
                            <div key={idx} className="row">
                                <div className="col-md-1">
                                        <i className="fa fa-check-circle" style={{color: "green"}} aria-hidden="false"></i>
                                </div>
                                <div className="col-md-10">
                                    <a> {wms.name}</a>
                                </div>
                            </div> :

                            <div key={idx} className="row">
                                <div className="col-md-1">
                                    <i className="fa fa-times-circle" style={{color: "#FF4748"}}  ></i>
                                </div>
                                <div className="col-md-10 text-muted">
                                    <a><del> {wms.name}</del></a>
                                </div>
                            </div>
                        )
                    )}
                    </div>
                   </td>
                   <td>
                    <div className="col-md-12">
                        {oid_table_list ? oid_table_list.map((oid, idx) =>
                                <div key={idx} className="row">
                                    <div className="col-md-1">
                                        <i className="fa fa-check-circle" style={{color: "green"}} aria-hidden="false"></i>
                                     </div>
                                    <div className="col-md-8">
                                        <a> {oid.nspname}.{oid.relname}</a>
                                    </div>
                                </div>
                            ) :
                            null
                        }
                    </div>
                   </td>
                <td>
                    <NavLink to={`/back/дэд-сан/${id}/засах/`}>
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
                            modalAction={this.props.handleRemove}
                            text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                        />
                    }
                </td>
                <td>
                    <a href="#" onClick={event => this.props.handleMove(event, id, 'up')}>
                        <i className="fa fa-chevron-up gp-text-primary" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <a href="#" onClick={event => this.props.handleMove(event, id, 'down')}>
                        <i className="fa fa-chevron-down gp-text-primary" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )
    }
}
