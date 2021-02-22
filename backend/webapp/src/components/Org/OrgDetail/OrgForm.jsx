import React, { Component } from "react"
import MapAllowedGeom from './MapAllowedGeom'
import {OrgEdit} from './OrgEdit'
import Modal from "../../Modal"
import ModalAlert from "../../ModalAlert"
import {service} from "../service"
import Loader from "@utils/Loader"

export class OrgForm extends Component {

    constructor(props) {
        super(props)
        this.state={
            is_open: false,
            modal_status: 'closed',
            modal_alert_status: 'closed',
            is_loading: false,
        }
        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.handleFormOpen = this.handleFormOpen.bind(this)
        this.handleUserDelete = this.handleUserDelete.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalAlertClose = this.modalAlertClose.bind(this)
    }

    handleFormOpen() {
        this.setState({ is_open: !this.state.is_open })
    }

    handleUserDelete(){
        const level = this.props.match.params.level
        const org_id = this.props.match.params.id
        service.org_remove(level,org_id).then(({ success }) => {
            if (success) {
                this.setState({ msg: "Амжилттай устгалаа", style: 'success' })
                this.setState({ modal_alert_status: 'open'})
                this.setState({ is_loading: true })
            }else{
                this.setState({ msg: "Амжилтгүй боллоо", style: 'danger' })
                this.setState({ modal_alert_status: 'open'})
                alert('Алдаа гарлаа!')
            }
            this.modalAlertClose()
        })
    }

    handleModalDeleteOpen() {
        this.setState({modal_status: 'open'})
    }

    handleModalDeleteClose() {
        this.setState({modal_status: 'closed'})
    }

    modalClose(){
        this.handleUserDelete()
        this.setState({modal_status: 'closed'})
    }

    modalAlertClose(){
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
            this.setState({modal_alert_status: "'closed'"})
        }, 2000)
    }

    render() {
        const { allowed_geom } = this.props
        const { is_open, msg, is_loading, style } = this.state
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6">
                        {
                            is_open
                            ?
                                <button
                                    className="btn gp-outline-primary"
                                    onClick={this.handleFormOpen}
                                >
                                    <i className="fa fa-angle-double-left"></i> Буцах
                                </button>
                            :
                                <div>
                                    <button
                                        className="btn btn-primary waves-effect waves-light m-1"
                                        onClick={this.handleFormOpen}
                                    >
                                        <i className="fa fa-pencil-square-o"></i> Засах
                                    </button>{' '}
                                    <button
                                        className="btn btn-danger waves-effect waves-light m-1"
                                        onClick={this.handleModalDeleteOpen}
                                    >
                                        <i className="fa fa fa-trash-o"></i> Устгах
                                    </button>
                                </div>
                        }<br/><br/>
                        {
                            is_open
                            ?
                                <OrgEdit
                                    level={org_level}
                                    id={org_id}
                                    FormClose={this.handleFormOpen}
                                />
                            :
                                null
                        }
                        <Modal
                            modalAction={() => this.modalClose()}
                            text={`Та байгууллагыг устгахдаа итгэлтэй байна уу?`}
                            title="Байгууллага устгах"
                            model_type_icon = "success"
                            status={this.state.modal_status}
                            modalClose={() => this.handleModalDeleteClose()}
                        />
                    </div>
                    <div className="col-6">
                        { allowed_geom &&
                            <MapAllowedGeom geom={ allowed_geom }/>
                        }
                    </div>
                </div>
                <ModalAlert
                    title={msg}
                    model_type_icon={style}
                    status={this.state.modal_alert_status}
                    modalAction={() => this.modalAlertClose()}
                />
                <Loader is_loading={is_loading}/>
            </div>
        )
    }

}