import React, {Component, Fragment} from "react"
import {service} from './service'
import {LLCMap} from '../../../llc/frontend/LLCMap'


export default class RequestApprove extends Component {

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
        this.handleModalAction = this.handleModalAction.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
        this.handleRequestReturn = this.handleRequestReturn.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
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

        if(this.state.action_type == 'reject')
        {
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
        const { zahialagch, project_name, object_type, object_count, hurungu_oruulalt, vector_datas } = this.props
        return (
            <div>
                <div className="row p-3">
                    <div className="col-md-5">
                        <form  class="form-row">
                            <div className="form-group col-md-12">
                                <label htmlFor=''>Захиалагч байгууллага</label>
                                <input
                                    type="text"
                                    name='zahialagch'
                                    className="form-control"
                                    value={zahialagch}
                                    onChange={(e) => {this.props.handleOnChange(e)}}
                                    disabled={true}
                                />
                            </div>
                            <div className="form-group col-md-12 m-0">
                                <label htmlFor=''>төслийн нэр</label>
                                <input
                                    type="text"
                                    name='project_name'
                                    className="form-control"
                                    value={project_name}
                                    onChange={(e) => {this.props.handleOnChange(e)}}
                                    disabled={true}
                                />
                            </div>
                            <div className="form-group col-md-6 my-4 col-sm-6">
                                <label htmlFor=''>Обьектийн төрөл</label>
                                <textarea
                                    type="text"
                                    name="object_type"
                                    className="form-control"
                                    value={object_type}
                                    onChange={(e) => {this.props.handleOnChange(e)}}
                                    disabled={true}
                                />
                            </div>
                            <div className="form-group col-md-6 col-sm-6 my-4">
                                <label htmlFor=''>Обьектийн тоо хэмжээ</label>
                                <textarea
                                    type="text"
                                    name="object_count"
                                    className="form-control"
                                    value={object_count}
                                    onChange={(e) => {this.props.handleOnChange(e)}}
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
                                    onChange={(e) => {this.props.handleOnChange(e)}}
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
                            `Та ${
                                values.length == 1
                                    ?
                                        get_modal_text(values[0].kind)
                                    :
                                values.length > 1
                                    ?
                                        `${values.length} өгөгдлөө`
                                    :
                                    null
                            }
                            татгалзахдаа итгэлтэй байна уу?`,
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
                            `Та ${
                                values.length == 1
                                    ?
                                        get_modal_text(values[0].kind)
                                    :
                                values.length > 1
                                    ?
                                        `${values.length} өгөгдлөө`
                                    :
                                    null
                            }
                            буцаахдаа итгэлтэй байна уу?`,
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
                            `Та ${
                                values.length == 1
                                    ?
                                        get_modal_text(values[0].kind)
                                    :
                                values.length > 1
                                    ?
                                        `${values.length} өгөгдөлд`
                                    :
                                    null
                            }
                            хүсэлт үүсгэх итгэлтэй байна уу?`,
                            true,
                            "Хүсэлт үүсгэх",
                            null
                        )}
                        className="btn gp-btn-outline-primary waves-effect waves-light ml-2"
                    >
                        <i className="fa fa-check">Хүсэлт үүсгэх</i>
                    </button>
                </div>
            </div>
        )
    }
}
