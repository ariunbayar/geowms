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
            disabled: true
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
        this.handleRequestDismiss = this.handleRequestDismiss.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        // this.getRequestIds = this.getRequestIds.bind(this)
    }

    // getRequestIds(selected_value, values) {
    //     let request_values
    //     let ids = []
    //     let feature_id

    //     if (selected_value){
    //         request_values = [selected_value]
    //     }
    //     else {
    //         request_values = values
    //     }
    //     request_values.map((value, idx) => {
    //         if (idx == 0) feature_id = value.feature_id
    //         ids.push(value.id);
    //     })
    //     return {ids, feature_id}
    // }

    handleModalAction(){
        // const { selected_value, values } = this.state
        const {ids, feature_id} = this.state
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
                        'Алдаа гарлаа. Объект олдсонгүй',
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
                        'Алдаа гарлаа. Объект олдсонгүй',
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
                        'Алдаа гарлаа.',
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
        service.handleRequestData(id).then(({ vector_datas, form_field }) => {
            if (form_field) {
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
    }

    handleModalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    render () {
        const { zahialagch, project_name, object_type, object_count, hurungu_oruulalt, vector_datas, is_loading, status } = this.state
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

                                {/* {
                                    this.props.requestContent
                                    &&
                                    <this.props.requestContent
                                        values={ this.props }
                                    />
                                } */}
                                <div className="row p-3">
                                    <Loader is_loading={is_loading} text={'Хүсэлтийг шалгаж байна түр хүлээнэ үү...'} />
                                        <div className="col-md-5">
                                            <form  class="form-row">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor=''>Захиалагч байгууллага</label>
                                                    <input
                                                        type="text"
                                                        name='zahialagch'
                                                        className="form-control"
                                                        value={zahialagch}
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div className="form-group col-md-12 m-0">
                                                    <label htmlFor=''>Төслийн нэр</label>
                                                    <input
                                                        type="text"
                                                        name='project_name'
                                                        className="form-control"
                                                        value={project_name}
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 my-4 col-sm-6">
                                                    <label htmlFor=''>Объектийн төрөл</label>
                                                    <textarea
                                                        type="text"
                                                        name="object_type"
                                                        className="form-control"
                                                        value={object_type}
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 col-sm-6 my-4">
                                                    <label htmlFor=''>Объектийн тоо хэмжээ</label>
                                                    <textarea
                                                        type="text"
                                                        name="object_count"
                                                        className="form-control"
                                                        value={object_count}
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor=''> Хөрөнгө оруулалтын байдал </label>
                                                    <textarea
                                                        name='hurungu_oruulalt'
                                                        rows="3"
                                                        className="form-control"
                                                        value={hurungu_oruulalt}
                                                        disabled={true}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-7">
                                            <LLCMap
                                                vector_datas={vector_datas}
                                                height="50vh"
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
                                                "Тохиргоог татгалзах",
                                                `Та татгалзахдаа итгэлтэй байна уу?`,
                                                true,
                                                "татгалзах",
                                                null
                                            )}
                                            className="btn gp-btn-primary waves-effect waves-light"
                                        >
                                            <i className="fa fa-check-square-o">Татгалзах</i>
                                        </button>
                                        <button
                                            type="button mr-2 ml-2"
                                            onClick={() => this.modalChange(
                                                'reject',
                                                'fa fa-exclamation-circle',
                                                'warning',
                                                "Тохиргоог буцаах",
                                                `Та буцаахдаа итгэлтэй байна уу?`,
                                                true,
                                                "буцаах",
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
                                                `Та хүсэлт үүсгэх итгэлтэй байна уу?`,
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
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <Modal
                            modal_status={this.state.modal_status}
                            title={this.state.title}
                            modalClose={this.state.modalClose}
                        /> */}
                    </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}
