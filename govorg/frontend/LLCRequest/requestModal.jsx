import React, {Component, Fragment} from "react"
import {service} from './service'
import Modal from "@utils/Modal/Modal"
import Loader from "@utils/Loader/index"
import {LLCMap} from '../../../llc/frontend/LLCMap'


export default class RequestModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            status: "initial",

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
            zahialagch: '',
            vector_datas: [],
            disabled: true,
            aimag_name: ''
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
        this.handleRequestDismiss = this.handleRequestDismiss.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.selectedFeature = this.selectedFeature.bind(this)
    }

    handleModalAction(){
        const { selected_value, values } = this.state
        let ids = []
        let feature_id
        this.setState({ is_loading: true })

        if(this.state.action_type == 'reject') {
            this.handleRequestReject(ids, feature_id)
        }
        if(this.state.action_type == 'approve') {
            this.handleRequestApprove(ids, feature_id)
        }
        if(this.state.action_type == 'dismiss') {
            this.handleRequestDismiss(ids, feature_id)
        }
    }

    handleRequestDismiss(ids, feature_id,) {
        service
            .requestDismiss(ids, feature_id)
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

    handleRequestReject(id, state) {
        service
            .requestReject(id, state)
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

    handleRequestApprove(ids, feature_id){
        service
            .requestApprove(ids, feature_id)
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

    render () {
        const { zahialagch, project_name, object_type,
            object_count, hurungu_oruulalt, vector_datas,
            is_loading, aimag_geom, aimag_name, status, selected_value } = this.state
        const className =
            "modal fade" +
            (status == "initial" ? " d-block" : "") +
            (status == "open" ? " show d-block" : "") +
            (status == "closing" ? " d-block" : "") +
            (status == "closed" ? " d-none" : "")

        const classNameBackdrop =
            "modal-backdrop fade" +
            (status == "open" ? " show" : "") +
            (status == "closed" ? " d-none" : "")
        return (
            <Fragment>
                <div className={className + " ml-3 mr-3 mb-3 mt-3 pl-3 pr-3 pb-3 pt-3 rounded text-wrap"} style={{height:"calc( 103vh - 85px - 15px)"}}>
                    <div className="col-md-10 d-flex justify-content-center container">
                        <div className="modal-content animated row" >
                            <div className="col-md-12">
                                <div className="row mt-2" style={{background:"white"}}>
                                    <div className="col-md-11">
                                        <h5 className="text-center text-justify">{this.props.title}</h5>
                                    </div>
                                    <div className="col-md-1" onClick={() => this.handleClose()}>
                                        <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>
                                    {
                                        this.props.model_body
                                        &&
                                        <this.props.model_body
                                            {...this.state}
                                        />
                                    }

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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}
