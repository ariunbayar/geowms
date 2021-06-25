import React, { Component } from "react"
import Loader from "@utils/Loader"

import { OrgEdit } from './OrgEdit'
import MapAllowedGeom from './MapAllowedGeom'

import { service } from "../service"
export class OrgForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_open: false,
            is_loading: false,
            allowed_geom: props.allow_geom,
        }
        this.handleFormOpen = this.handleFormOpen.bind(this)
        this.handleUserDelete = this.handleUserDelete.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.handleHistoryPush = this.handleHistoryPush.bind(this)
        this.getGeom = this.getGeom.bind(this)
    }

    getGeom() {
        const level = this.props.match.params.level
        const org_id = this.props.match.params.id
        service
            .orgAll(level, org_id)
            .then(({ orgs }) => {
                orgs.map((org) => {
                    this.setState({ allowed_geom: org.allowed_geom })
                })
            })
    }

    setModal(title, text, icon_color, icon, has_button, action, close) {
        const modal = {
            modal_status: "open",
            modal_icon: icon,
            modal_bg: '',
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            actionNameBack: 'Буцах',
            actionNameDelete: '',
            modalAction: action,
            modalClose: close,
        }
        global.MODAL(modal)
    }

    handleFormOpen() {
        this.setState({ is_open: !this.state.is_open })
    }

    handleUserDelete() {
        const level = this.props.match.params.level
        const org_id = this.props.match.params.id
        service
            .org_remove(level,org_id)
            .then(({ success }) => {
                this.setState({ is_loading: true })
                if (success) {
                    this.setModal('Амжилттай устгалаа', '', 'success', 'fa fa-check-circle', false, null, this.modalClose)
                }
                else {
                    this.setModal('Амжилтгүй боллоо', '', 'danger', 'fa fa-check-circle', false, null, this.modalClose)
                }
            })
    }

    handleModalDeleteOpen() {
        this.setModal('Байгууллага устгах', 'Та байгууллагыг устгахдаа итгэлтэй байна уу?', 'warning', 'fa fa-exclamation-circle', true, this.handleUserDelete)
    }

    modalClose(){
        const org_level = this.props.match.params.level
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/`)
    }

    handleHistoryPush(org_level) {
        const org_id = this.props.match.params.id
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/detail/`)
        global.refreshOrgCount(org_level)
    }

    render() {
        const { allowed_geom } = this.state
        const { is_open, is_loading } = this.state
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
                        }
                        <br/><br/>
                        {
                            is_open
                            ?
                                <OrgEdit
                                    level={org_level}
                                    id={org_id}
                                    FormClose={this.handleFormOpen}
                                    getGeom={this.getGeom}
                                    PushHistory={this.handleHistoryPush}
                                />
                            :
                                null
                        }
                    </div>
                    <div className="col-6">
                        { allowed_geom &&
                            <MapAllowedGeom geom={ allowed_geom }/>
                        }
                    </div>
                </div>
                <Loader is_loading={is_loading}/>
            </div>
        )
    }

}
