import React, { Component } from "react"
import RequestModal from './requestModal'
import {LLCMap} from '../../../llc/frontend/LLCMap'
import {service} from './service'
import Modal from "@utils/Modal/Modal"
import Loader from "@utils/Loader/index"

class GetDescription extends Component {
    constructor(props) {
        super(props)

        this.state = {
            description: props.description
        }
        this.handleOnchange = this.handleOnchange.bind(this)
    }

    handleOnchange(e) {
        this.props.handleOnChange(e)
    }

    render() {
        const {description} = this.state
        return(
            <div className="col-md-12">
                <label>Тайлбар оруулна уу </label>
                <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => this.handleOnchange(e)}
                />
            </div>
        )
    }
}

class DetailModalBody extends Component {
    constructor(props) {
        super(props)

        this.state = {
            status: "initial",
            is_loading: false,
            action_type: '',
            modal_status: "closed",
            title: '',
            has_button: false,
            modalClose: null,

            values: props.values,
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            vector_datas: [],
            disabled: true,
            aimag_name: '',
            description: ''
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
        this.handleRequestDismiss = this.handleRequestDismiss.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.selectedFeature = this.selectedFeature.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange(e) {
        this.setState({ description: e.target.value })
    }

    handleModalAction() {
        var id = this.props.id
        var description = this.state.description
        this.setState({ is_loading: true })
        if(this.state.action_type == 'reject') {
            this.handleRequestReject(id)
        }
        if(this.state.action_type == 'approve') {
            this.handleRequestApprove(id)
        }
        if(this.state.action_type == 'dismiss') {
            this.handleRequestDismiss(id, description)
        }
    }

    handleRequestDismiss(id, description) {
        service
            .requestDismiss(id, description)
            .then(({ success, info }) => {
                if(success) {
                    this.modalChange(
                        '',
                        'fa fa-check-circle',
                        'success',
                        info,
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                    this.setState({ is_loading: false })
                }
                else {
                    this.modalChange(
                        '',
                        'fa fa-times-circle',
                        'danger',
                        info,
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа. Объект олдсонгүй',
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                }
            })
    }

    handleRequestReject(id) {
        service
            .requestReject(id)
            .then(({ success, info }) => {
                if(success) {
                    this.modalChange(
                        '',
                        'fa fa-check-circle',
                        'success',
                        info,
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                    this.setState({ is_loading: false })
                }
                else {
                    this.modalChange(
                        '',
                        'fa fa-times-circle',
                        'danger',
                        info,
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа. Объект олдсонгүй',
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                }
            })
    }

    handleRequestApprove(id){
        service
            .requestApprove(id)
            .then(({ success, info }) => {
                if(success) {
                    this.modalChange(
                        '',
                        'fa fa-check-circle',
                        'success',
                        info,
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                    this.setState({ is_loading: false })
                }
                else {
                    this.modalChange(
                        '',
                        'fa fa-times-circle',
                        'danger',
                        info,
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа.',
                        '',
                        false,
                        "",
                        this.handleClose
                        )
                    }
                })
    }

    componentDidMount() {
        if (this.state.status == "initial") this.handleOpen()
        // const {id} = .id
        var id = this.props.id
        service.handleRequestData(id).then(({ vector_datas, form_field, selected_tools, aimag_name, aimag_geom }) => {
            if (form_field) {
                this.setState({
                    vector_datas,
                    zahialagch :form_field['client_org'],
                    project_name : form_field['project_name'],
                    object_type : form_field['object_type'],
                    object_count : form_field['object_quantum'],
                    hurungu_oruulalt : form_field['investment_status'],
                    selected_tools,
                    aimag_name,
                    aimag_geom
                })
            }
        })
    }

    handleOpen() {
        this.setState({ status: "open" })
    }

    handleClose() {
        this.setState({status: "closed"})
        this.props.modalClose()
    }

    modalChange(action_type, modal_icon, icon_color, title, text, has_button, action_name, modalClose) {
        this.setState({
            action_type,
            modal_icon,
            icon_color,
            title,
            text,
            has_button,
            action_name,
            modalClose
        })
        this.handleModalOpen()
    }

    handleModalOpen(){
        this.setState({ is_loading: false, modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    selectedFeature(e) {
        const feature = e.selected[0]
        if (feature) {
            const { values } = this.props
            const id = feature.getProperties()['id']
            values.map((value, idx) => {
                if (value.id == id) {
                    this.setState({ form_json: value.form_json, selected_value: value })
                }
            })
        }
    }


    render() {
        const {
            aimag_name, zahialagch,
            project_name, object_type,
            object_count, hurungu_oruulalt,
            vector_datas, aimag_geom, is_loading
        } = this.state
        var is_disable = true
        const { kind } = this.props
        return(
            <>
            <div className="row p-3">
                <Loader is_loading={is_loading} text={'Хүсэлтийг шалгаж байна түр хүлээнэ үү...'} />
                <div className="col-md-5">
                    <form  class="form-row">
                        {
                            aimag_name
                            &&
                                <div className="form-group col-md-12">
                                    <label htmlFor=''>Өгөгдлийн хамрагдаж буй аймгийн нэр</label>
                                    <input
                                        type="text"
                                        name='aimag_name'
                                        className="form-control"
                                        disabled={is_disable}
                                        value={aimag_name}
                                    />
                                </div>
                        }
                        <div className="form-group col-md-12">
                            <label htmlFor=''>Захиалагч байгууллага</label>
                            <input
                                type="text"
                                name='zahialagch'
                                className="form-control"
                                value={zahialagch}
                                disabled={is_disable}
                            />
                        </div>
                        <div className="form-group col-md-12 m-0">
                            <label htmlFor=''>Төслийн нэр</label>
                            <input
                                type="text"
                                name='project_name'
                                className="form-control"
                                value={project_name}
                                disabled={is_disable}
                            />
                        </div>
                        <div className="form-group col-md-6 my-4 col-sm-6">
                            <label htmlFor=''>Объектийн төрөл</label>
                            <textarea
                                type="text"
                                name="object_type"
                                className="form-control"
                                value={object_type}
                                disabled={is_disable}
                            />
                        </div>
                        <div className="form-group col-md-6 col-sm-6 my-4">
                            <label htmlFor=''>Объектийн тоо хэмжээ</label>
                            <textarea
                                type="text"
                                name="object_count"
                                className="form-control"
                                value={object_count}
                                disabled={is_disable}
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor=''> Хөрөнгө оруулалтын байдал </label>
                            <textarea
                                name='hurungu_oruulalt'
                                rows="3"
                                className="form-control"
                                value={hurungu_oruulalt}
                                disabled={is_disable}
                            />
                        </div>
                    </form>
                </div>
                <div className="col-md-7">
                    <LLCMap
                        vector_datas={vector_datas}
                        height="50vh"
                        aimag_geom={aimag_geom}
                        selectedFeature={this.selectedFeature}
                    />
                </div>
            </div>
            <div className="row my-2 mr-1 float-right">
                <button
                    type="button mr-2 ml-2"
                    onClick={() => this.modalChange(
                        'reject',
                        'fa fa-exclamation-circle',
                        'warning',
                        "Тохиргоог цуцлах",
                        `Та цуцлахдаа итгэлтэй байна уу?`,
                        true,
                        "цуцлах",
                        null
                    )}
                    className="btn gp-btn-primary waves-effect waves-light"
                >
                    <i className="fa fa-check-square-o">Цуцлах</i>
                </button>
                <button
                    type="button mr-2 ml-2"
                    onClick={() => this.modalChange(
                        'dismiss',
                        'fa fa-exclamation-circle',
                        'warning',
                        "Тохиргоог буцаах",
                        GetDescription,
                        true,
                        "илгээх",
                        null
                    )}
                    className="btn gp-btn-primary waves-effect waves-light ml-2"
                >
                    <i className="fa fa-check-square-o">Буцаах</i>
                </button>
                <button
                    type="button mr-2 ml-2"
                    onClick={() => this.modalChange(
                        'approve',
                        'fa fa-exclamation-circle',
                        'warning',
                        "Хүсэлт үүсгэх",
                        `Та хүсэлт үүсгэхдээ итгэлтэй байна уу?`,
                        true,
                        "Хүсэлт үүсгэх",
                        null
                    )}
                    className="btn gp-btn-outline-primary waves-effect waves-light ml-2"
                >
                    <i className="fa fa-check">Хүсэлт үүсгэх</i>
                </button>
            </div>
            <Modal
                modal_status={this.state.modal_status}
                modal_icon={this.state.modal_icon}
                icon_color={this.state.icon_color}
                title={this.state.title}
                has_button={this.state.has_button}
                text={this.state.text}
                modalAction={this.handleModalAction}
                actionNameDelete={this.state.action_name}
                modalClose={this.state.modalClose}
                handleOnChange={this.handleOnChange}
            />
            </>
        )
    }
}

export default class SolveModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_modal_request_open: false,
            values: props.values,
            state: props.values.state,
        }
        this.openModalMap = this.openModalMap.bind(this)
        this.closeModalMap = this.closeModalMap.bind(this)
    }

    openModalMap() {
        this.setState({ is_modal_request_open: true })
    }

    closeModalMap() {
        this.setState({ is_modal_request_open: false })
        this.props.refreshData()
    }


    render() {
        const { is_modal_request_open, state } = this.state
        return (
            <div>
                {
                    state == "ШИНЭ"
                    &&
                        <a
                            className="btn btn-primary btn-sm text-white text-capitalize"
                            onClick={this.openModalMap}
                        >
                            Шийдвэрлэх
                        </a>
                }
                {
                    is_modal_request_open
                    &&
                        <RequestModal
                            modalClose={this.closeModalMap}
                            model_body={DetailModalBody}
                            {...this.props.values}
                            title={'Хүсэлт шийдвэрлэх'}
                        />
                }
            </div>
        )
    }
}
