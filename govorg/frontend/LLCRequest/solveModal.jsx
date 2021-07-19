import React, { Component, useState } from "react"
import RequestModal from './requestModal'

import Modal from "@utils/Modal/Modal"
import Loader from '@utils/Loader'

import InspireField from './InspireField'
import { LLCMap } from '../../../llc/frontend/LLCMap'
import { LlcPPBody } from "./LlcPPBody"

import { service } from './service'

export class DetailModalBody extends Component {
    constructor(props) {
        super(props)

        this.state = {
            is_loading: false,
            datas: [],
            current_count: 0
        }
        this.selectedFeature = this.selectedFeature.bind(this)
        this.changeCurrentData = this.changeCurrentData.bind(this)
        this.handleErrors = this.handleErrors.bind(this)
    }

    changeCurrentData(state) {
        let {current_count, datas} = this.state
        var feature_count = datas.length - 1
        if(state) {
            if (current_count < feature_count) {
                current_count = current_count + 1
            }
            else current_count = 0
        }
        else {
            if (current_count > 0) {
                current_count = current_count - 1
            }
            else current_count = feature_count
        }
        this.setState({ current_count })
    }

    componentDidMount() {
        var id = this.props.id
        service.handleRequestData(id).then(({ datas }) => {
            if (datas) this.setState({ datas })
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

    handleErrors(errors) {
        this.setState({ current_count: errors['list_idx'] })
    }

    render() {
        const {
            datas, current_count
        } = this.state
        var current_data = datas[current_count]
        return(
            <>
                <div className="col-md-12">
                    <div className="mx-1 px-4">
                        <div className="col-md-12 pb-5 mt-2 fa-2x text-dark d-flex justify-content-between">
                            <label
                                className="col-6 fa fa-angle-double-left btn btn-outline-primary mr-1"
                                disabled={!current_data && true}
                                onClick={(e) => this.changeCurrentData(false)}
                            >
                            </label>
                            <label
                                className="col-6 fa fa-angle-double-right btn btn-outline-primary ml-1"
                                disabled={!current_data && true}
                                onClick={(e) => this.changeCurrentData(true)}
                            >
                            </label>
                        </div>
                            {
                                current_data
                                &&
                                    <div className="col-md-12 pb-5 mt-2">
                                        <div className="form-row">
                                            <InspireField
                                                title_name='theme'
                                                defualt_value={current_data.theme?.name || ''}
                                            />
                                            <InspireField
                                                title_name='package'
                                                defualt_value={current_data.package?.name || ''}
                                            />
                                            <InspireField
                                                title_name='feature'
                                                defualt_value={current_data.feature?.name || ''}
                                            />
                                        </div>
                                        <div className="col-md-12 pb-5 mt-2 px-0">
                                            <div className="form-row d-flex justify-content-between">
                                                <InspireField
                                                    title_name='Тушаалын дугаар'
                                                    defualt_value={current_data?.order_no || ''}
                                                    className="my-2 col-md-6"
                                                />
                                                <InspireField
                                                    title_name='Тушаал гарсан огноо'
                                                    defualt_value={current_data?.order_at || ''}
                                                    className="my-2 col-md-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12 mx-0 px-0">
                                            <Map
                                                vector_datas={current_data?.features || []}
                                                height={'60vh'}
                                                PPComponent={LlcPPBody}
                                            />
                                        </div>
                                    </div>
                            }
                    </div>
                </div>
                <div>
                    <Form
                        {...this.props}
                        {...this.state}
                        modalClose={this.props.modalClose}
                        handleErrors={this.handleErrors}
                    />
                </div>
            </>
        )
    }
}

class Form extends Component {
    constructor(props) {
        super(props)

        this.state = {
            status: "initial",
            action_type: '',
            modal_status: "closed",
            title: '',
            has_button: false,
            modalClose: null,
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
        this.handleRequestDismiss = this.handleRequestDismiss.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange(e) {
        var description = e.target.value
        this.state.description = description
        if(description.length > 0 && this.state.has_button == false) {
            this.setState({ has_button: true })
        }
        else if(!description) {
            this.setState({ has_button: false })
        }
    }

    handleModalAction() {
        var id = this.props.id
        var description = this.state.description
        this.setState({ is_loading: true })
        if(this.state.action_type == 'reject') {
            this.handleRequestReject(id, description)
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
                    global.refreshCount()
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
                this.setState({ is_loading: false })
            })
            .catch((error) => {
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
                this.setState({ is_loading: false })
            })
    }

    handleRequestReject(id, description) {
        service
            .requestReject(id, description)
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
                    global.refreshCount()
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
                this.setState({ is_loading: false })
            })
            .catch((error) => {
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
                this.setState({ is_loading: false })
            })
    }

    handleRequestApprove(id){
        service
            .requestApprove(id)
            .then(({ success, data, error }) => {
                if(success) {
                    this.modalChange(
                        '',
                        'fa fa-check-circle',
                        'success',
                        data,
                        '',
                        false,
                        "",
                        this.handleClose
                    )
                    global.refreshCount()
                }
                else {
                    this.props.handleErrors(error)
                }
                this.setState({ is_loading: false })
            })
            .catch((error) => {
                this.setState({ is_loading: false })
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
                this.setState({ is_loading: false })
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

    render() {
        return(
            <>
                <Loader is_loading={this.state.is_loading}/>
                <div className="row my-2 mr-1 float-right">
                    <button
                        type="button mr-2 ml-2"
                        onClick={() => this.modalChange(
                            'reject',
                            'fa fa-exclamation-circle',
                            'warning',
                            "Тохиргоог цуцлах",
                            GetDescription,
                            this.state.has_button,
                            "илгээх",
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
                            this.state.has_button,
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
                description={this.state.description}
            />
            </>
        )
    }
}

class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { vector_datas, height, PPComponent } = this.props
        return (
            <LLCMap
                vector_datas={vector_datas}
                height={height}
                PPComponent={PPComponent}
            />
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
            kind: props.values.kind
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
        const { is_modal_request_open, state, kind } = this.state
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

function GetDescription(props) {

    const [value, setValue] = useState('')

    const handleOnChange = (e) => {
        setValue(e.target.value)
        props.handleOnChange(e)
    }

    return (
        <div className="col-md-12">
            <label htmlFor="desc">Тайлбар оруулна уу</label>
            <textarea
                id="desc"
                className={`form-control ${value ? '' : 'is-invalid'}`}
                onChange={handleOnChange}
            />
        </div>
    )
}
