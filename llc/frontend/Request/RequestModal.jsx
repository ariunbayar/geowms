import React, { Component } from "react"
import { service } from "./service"
import RequestDetail from './DirectModal'
import ModelSendData from './send_request'
import Modal from '@utils/Modal/Modal'
import Loader from "@utils/Loader"

class ActionClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: "/llc/llc-request/",
            modal_status: 'closed',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    handleModalOpen() {
        this.modalChange(
            'fa fa-info-circle',
            'warning',
            'Хүсэлт илгээхдээ итгэлтэй байна уу?',
            '',
            true,
            'Үгүй',
            'Тийм',
        )
    }

    handleSubmit() {
        const { mergejilten, id } = this.props
        this.props.enableLoader(true)
        service.sendRequest(id, mergejilten).then(({ success, info }) =>{
            if(success) {
                this.modalChange(
                    'fa fa-check-circle',
                    'success',
                    'Амжилттай',
                    info,
                    false,
                    '',
                    '',
                    null,
                )
            }
            else {
                this.modalChange(
                    'fa fa-times-circle',
                    'danger',
                    'Алдаа гарлаа',
                    info,
                    false,
                    '',
                    '',
                    null,
                )
            }
            this.props.enableLoader(false)
        })
    }

    modalClose() {
        const { values } = this.props
        this.setState({ modal_status: 'closed' })
        values.closeRequestMap()
    }

    modalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, icon_color, title, text, has_button, actionNameBack, actionNameDelete) {
        this.setState({
            modal_icon,
            icon_color,
            title,
            text,
            has_button,
            actionNameBack,
            actionNameDelete,
        }, () => {
            this.modalOpen()
        })
    }

    render() {
        return (
            <div className='row ml-2 my-4'>
                <p
                    className="btn btn-secondary"
                    onClick ={()=> this.modalClose()}>
                        Буцах
                </p>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

                <p
                    className="btn btn-primary"
                    onClick ={()=> this.handleModalOpen()}
                >
                    <i className="fa"> Хүсэлт илгээх</i>
                </p>
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    title={ this.state.title }
                    text={ this.state.text }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.handleSubmit}
                    modalClose={ this.modalClose}
                />
            </div>
        )
    }
}

class SendModal extends Component{
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            zahialagch: '',
            vector_datas: [],
            aimag_name: '',
            aimag_geom: [],
            selected_tools: [],
            mergejilten: '',
            is_loading: false,
            disabled: true
        }
    }

    componentDidMount() {
        const values = this.props.values
        const { id } = values.field
        this.setState({ is_loading: true })
        service.handleRequestData(id).then(({ vector_datas, form_field, emp_fields, aimag_name, aimag_geom }) =>{
            if (form_field) {
                this.setState({
                    files: form_field['file_path'],
                    zahialagch: form_field['client_org'],
                    project_name: form_field['project_name'],
                    object_type: form_field['object_type'],
                    object_count: form_field['object_quantum'],
                    hurungu_oruulalt: form_field['investment_status'],
                    selected_tools: form_field['selected_tools'],
                    vector_datas,
                    aimag_name,
                    aimag_geom,
                    emp_fields,
                    is_loading: false
                })
            }
            this.props.handleIsload(false)
        })
    }

    render() {
        const { id } = this.props.values.field
        return (
            <div className="col-md-12">
                <Loader is_loading={this.state.is_loading}/>
                <div className="row mt-2" style={{background:"white"}}>
                    <RequestDetail
                        id={id}
                        {...this.state}
                        submitClass={ActionClass}
                        closeRequestMap={this.props.closeRequestMap}
                        info={this.props.values.info}
                    />
                </div>
            </div>
        )
    }
}

export default class RequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: props.values,
            modal_status: 'closed',
            state: props.values.state,
            kind: props.values.kind,
            invis: false
        }
        this.openRequestModal = this.openRequestModal.bind(this)
        this.closeRequestMap = this.closeRequestMap.bind(this)
    }

    componentDidMount() {
        if(this.state.kind == 'ЦУЦЛАСАН')
            this.setState({ invis: true })
    }

    openRequestModal() {
        this.setState({ modal_status:'open' })
    }

    closeRequestMap() {
        this.setState({ modal_status: 'closed' })
        this.props.refreshData()
    }

    render() {
        const { values, modal_status, state, kind, invis } = this.state
        return (
            <div className="col-md-12 ">
                {
                    !invis
                    ?
                        !(values.state=="ИЛГЭЭСЭН" && values.kind=='ХҮЛЭЭГДЭЖ БУЙ')
                                ?
                                    <a className={`fa fa-paper-plane-o text-primary mt-2 ml-2`} onClick={this.openRequestModal}></a>
                                :
                                    <a className="fa fa-check text-success mt-2 ml-2" ></a>
                    :
                        null
                }
                {
                    modal_status == 'open'
                    &&
                        <ModelSendData
                            body={SendModal}
                            field ={values}
                            status={modal_status}
                            modal_dialog={true}
                            modal_bg= 'white'
                            info={true}
                            title='Хүсэлт Илгээх'
                            closeRequestMap={this.closeRequestMap}
                        />
                }
                </div>
        )
    }
}


