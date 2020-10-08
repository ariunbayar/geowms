import React, { Component } from "react"
import "./styles.css";
import Modal from "../Modal"
import {NavLink} from "react-router-dom"


export default class Bundle extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: "closed",
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.modalClose = this.modalClose.bind(this)

    }

    handleModalDeleteOpen() {
        this.setState({modal_status: "open"})
    }

    handleModalDeleteClose() {
        this.setState({modal_status: "closed"})
    }

    modalClose(){
        this.props.handleRemove()
        this.setState({modal_status: 'closed'})
    }

    render() {
        const {id, name, price, icon_url, wms_list, oid_list} = this.props.values
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
                        {oid_list.map((oid, idx) =>
                                <div key={idx} className="row">
                                    <div className="col-md-1">
                                        <i className="fa fa-check-circle" style={{color: "green"}} aria-hidden="false"></i>
                                     </div>
                                    <div className="col-md-8">
                                        <a> {oid}</a>
                                    </div>
                                </div>
                            )
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
                    <Modal
                        modalAction={() => this.modalClose()}
                        text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                        title="Байгууллага устгах"
                        model_type_icon = "success"
                        status={this.state.modal_status}
                        modalClose={() => this.handleModalDeleteClose()}
                    />
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
