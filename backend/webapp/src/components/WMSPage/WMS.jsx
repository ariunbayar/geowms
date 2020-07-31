import React, { Component } from "react"

import Modal from "../Modal"
import {NavLink} from "react-router-dom"
import {service} from "./service"
import ModalLimit from "../UserPage/ModalLimit"

export default class WMS extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: 'closed',
            is_active: this.props.values.is_active,
            is_modal_limit_open:false   
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.wmsIsActiveTrue = this.wmsIsActiveTrue.bind(this)
        this.wmsIsActiveFalse = this.wmsIsActiveFalse.bind(this)
        this.handleModalLimitClose=this.handleModalLimitClose.bind(this)
        this.handleModalLimitOpen=this.handleModalLimitOpen.bind(this)
        

    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({modal_status: 'open'})
    }

    handleModalLimitOpen() {
        this.setState({is_modal_limit_open: !this.state.is_modal_limit_open})
     }

    handleModalLimitClose() {
        this.setState({is_modal_delete_open: false})

    }

    wmsIsActiveTrue(id) {
        service.wmsIsActiveUpdate(id, true).then(({success}) => {
            if (success) {
                this.setState({is_active: true})
            }
        })
    }

    wmsIsActiveFalse(id) {
        service.wmsIsActiveUpdate(id, false).then(({success}) => {
            if (success) {
                this.setState({is_active: false})
            }
        })
    }

    render() {

        const {id, name, url, public_url, created_at} = this.props.values
        const {is_active,is_modal_limit_open} = this.state
        return (
            <tr>
                <th>
                    {id}
                    
                </th>
                <td>
                    {name}
                    <br/>
                    <a className="text-muted"> {url}</a>
                   
                </td>

                <td>
                    {public_url}
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    {is_active ? 
                    <button  onClick={this.handleModalLimitOpen} className="btn btn-danger" style={{width:"100%"}}>Хязгаарлах</button> :
                    <button  onClick={() => this.wmsIsActiveTrue(id)} className="btn btn-success">Идэвхжүүлэх</button>}
                    {is_modal_limit_open &&
                        <ModalLimit
                            modalClose={this.handleModalLimitClose}
                            modalAction={() => this.wmsIsActiveFalse(id)}
                            text={`Та "${name}" нэртэй WMS-ийн эрхийн түвшинг хязгааралах гэж байна !`}
                            title="Тохиргоог хязгаарлах"
                        />
                    }  
                </td>
                <td>
                    <NavLink to={`/back/wms/${id}/засах/`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                    <Modal
                        modalAction={this.props.handleRemove}
                        text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                        title="Тохиргоог устгах"
                        status={this.state.modal_status}
                    />
                </td>
            </tr>
        )
    }
}