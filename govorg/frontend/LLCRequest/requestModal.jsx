import React, {Component, Fragment} from "react"
import {service} from './service'
import Modal from "@utils/Modal/Modal"
import Loader from "@utils/Loader/index"


export default class RequestModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            status: "initial",

            action_type: '',
            modal_status: "closed",
            modal_icon: 'fa fa-check-circle',
            icon_color: 'success',
            title: '',
            text: '',
            model_type_icon: '',
            has_button: false,
            action_name: '',
            modalClose: null,

            values: props.values,

            files:[],
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            zahialagch: '',
            modal_status:'closed',
            vector_datas: [],
            disabled: true
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
        this.handleRequestReturn = this.handleRequestReturn.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
    }

    handleModalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    getRequestIds(selected_value, values) {
        let request_values
        let ids = []
        let feature_id

        if (selected_value){
            request_values = [selected_value]
        }
        else {
            request_values = values
        }
        request_values.map((value, idx) => {
            if (idx == 0) feature_id = value.feature_id
            ids.push(value.id);
        })
        return {ids, feature_id}
    }

    handleModalAction(){
        const { selected_value, values } = this.state
        const {ids, feature_id} = this.getRequestIds(selected_value, values)
        this.setState({ is_loading: true })

        if(this.state.action_type == 'reject') {
           this.handleRequestReject(ids, feature_id)
        }
        if(this.state.action_type == 'approve') {
            this.handleRequestApprove(ids, feature_id)
        }
        if(this.state.action_type == 'return') {
            this.handleRequestReturn(ids, feature_id)
        }
    }

    handleRequestReturn(ids, feature_id,) {
        service
            .requestReject(ids, feature_id)
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
                        this.handleModalClose
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
                        this.handleModalClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа. Обьект олдсонгүй',
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                }
            })
    }

    handleRequestReject(ids, feature_id,) {
        service
            .requestReject(ids, feature_id)
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
                        this.handleModalClose
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
                        this.handleModalClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа. Обьект олдсонгүй',
                        '',
                        false,
                        "",
                        this.handleModalClose
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
                        this.handleModalClose
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
                        this.handleModalClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа',
                        '',
                        false,
                        "",
                        this.handleModalClose
                        )
                    }
                })
    }

    componentDidMount() {
        if (this.state.status == "initial") this.handleOpen()

        const {id} = this.state.values
        service.handleRequestData(id).then(({ vector_datas, form_field}) =>{
            if (form_field){
                this.setState({
                    vector_datas,
                    zahialagch :form_field['client_org'],
                    project_name : form_field['project_name'],
                    object_type : form_field['object_type'],
                    object_count : form_field['object_quantum'],
                    hurungu_oruulalt : form_field['investment_status'],
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

    handleModalClose() {
        this.setState({ is_loading: false })
        this.props.refreshData()
    }

    render () {

        const selected_form_json = this.state.form_json
        const { is_loading, status, values,
            disabled, object_type, object_count,
            hurungu_oruulalt, zahialagch,
            project_name, vector_datas } = this.state
        const hide_btn = this.props.hide_btn
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
                                    this.props.requestContent
                                    &&
                                    <this.props.requestContent
                                        values={ this.props}
                                    />
                                }
                            </div>
                            </div>
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
                    />
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}
