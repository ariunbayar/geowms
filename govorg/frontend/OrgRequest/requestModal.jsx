import React, {Component, Fragment} from "react"
import RequestMap from './Map/Map'

import {service} from './service'
import Modal from "@utils/Modal/Modal"
import Loader from "@utils/Loader/index"

export const get_modal_text = (kind) => {
    let text = ''
    if (kind == 'ҮҮССЭН') text = 'шинэ геометр өгөгдөл үүсгэхийг'
    else if (kind == 'ЗАССАН') text ='засагдсан геометр өгөгдлийг'
    else if (kind == 'УСТГАСАН') text = 'геометр өгөгдлийг устгахыг'
    return text
}

export const FormJson = ({form_json, handleModalOpen, modalClose, values}) => {
    return (
        <div className="col-md-4 overflow-auto text-justify" style={{height:"calc( 90vh - 85px - 15px)"}}>
            {
                handleModalOpen && !values.llc_request_id
                ?
                <div className="row">
                    <div className="col-md-4">
                        <button
                            className="btn gp-btn-primary"
                            onClick={() => handleModalOpen(
                                'reject',
                                'fa fa-exclamation-circle',
                                'warning',
                                "Тохиргоог татгалзах",
                                `Та ${
                                    get_modal_text(values.kind)
                                }
                                татгалзахдаа итгэлтэй байна уу?`,
                                true,
                                "татгалзах",
                                modalClose
                            )}
                        >
                            Татгалзах
                        </button>
                    </div>
                    <div className="ml-auto kindmr-3">
                        <button
                            className="btn gp-btn-outline-primary"
                            onClick={() => handleModalOpen(
                                'approve',
                                'fa fa-exclamation-circle',
                                'warning',
                                "Тохиргоог зөвшөөрөх",
                                `Та ${
                                    get_modal_text(values.kind)
                                }
                                зөвшөөрөхдөө итгэлтэй байна уу?`,
                                true,
                                "зөвшөөрөх",
                                modalClose
                            )}
                        >
                            Зөвшөөрөх
                        </button>
                    </div>
                </div>
            :
                null
            }
            {handleModalOpen && <hr/>}
            {
                form_json
                ?
                    form_json.map((prop, idx) =>
                        <div key={idx} className="row my-3">
                            <div className="col-md-5">
                                <label className="col-form-label">{prop.property_name}</label>
                            </div>
                            <div className="col-md-7">
                                <input
                                    className='form-control'
                                    disabled={true}
                                    value={prop.data || ''}
                                    type={prop.value_type}
                                />
                            <div  className="col-form-label " >{prop.property_definition}</div>
                            </div>
                        </div>
                    )
                :
                    null
            }
        </div>
    )
}


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
            desc: '',

            values: props.values,
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.selectedFeature = this.selectedFeature.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.getDesc = this.getDesc.bind(this)
        this.getRefViewStatus = this.getRefViewStatus.bind(this)
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

    getRefViewStatus(state, e){
        if (state == 'Direct'){
            this.setState({ref_in_direct: e.target.checked})
        }
        else{
            this.setState({ref_in_direct: false})
        }
    }

    handleModalAction(){
        const { selected_value, values, desc, action_type, ref_in_direct } = this.state

        const {ids, feature_id} = this.getRequestIds(selected_value, values)
        this.setState({ is_loading: true })

        const not_done = ['revoke', 'reject', 'dismiss']
        if(not_done.includes(action_type))
        {
            this.handleRequestReject(ids, feature_id, desc, action_type)
        }
        if(action_type == 'approve') {
            this.handleRequestApprove(ids, feature_id, ref_in_direct)
        }
    }

    handleRequestReject(ids, feature_id, desc, action_type) {
        service
            .requestReject(ids, feature_id, desc, action_type)
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

    handleRequestApprove(ids, feature_id, ref_in_direct){
        service
            .requestApprove(ids, feature_id, ref_in_direct)
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
    }

    handleOpen() {
        this.setState({ status: "open" })
    }

    handleClose() {
        this.setState({status: "closed"})
        this.props.modalClose()
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

    getDesc(e) {
        this.state.desc = e.target.value
    }

    render () {

        const selected_form_json = this.state.form_json
        const { is_loading, status, selected_value, values } = this.state
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
                                        {
                                            hide_btn
                                            ?
                                            <h5 className="text-center text-justify">Хүсэлт шийдвэрлэгдсэн </h5>
                                            :
                                            <h5 className="text-center text-justify">Хүсэлт шийдвэрлэx</h5>
                                        }
                                    </div>
                                    <div className="col-md-1" onClick={() => this.handleClose()}>
                                        <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>
                                {
                                    values && values.length > 0
                                    ?
                                        values.map((value, idx) => {
                                            const { form_json } = value
                                            if (idx == values.length - 1) {
                                                return (
                                                    <div key={idx} className="row">
                                                        {
                                                            values.length == 1
                                                            ?
                                                                form_json && <FormJson form_json={form_json}/>
                                                            :
                                                                selected_form_json && <FormJson form_json={selected_form_json} handleModalOpen={this.modalChange} modalClose={this.modalClose} values={selected_value}/>
                                                        }
                                                        <div className={selected_form_json || (values.length == 1 && form_json) ? "col-md-8" : "col-md-12"}>
                                                            <RequestMap values={values} selectedFeature={this.selectedFeature}/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    :
                                        null
                                }
                                {
                                    hide_btn
                                    ?
                                        <div className="row my-2 mr-1 float-right"></div>
                                    :
                                        <div className="row my-2 mr-1 float-right">
                                            {
                                                values.length > 0 && !values[0].llc_request_id
                                                ?
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
                                                                        `сонгосон ${values.length} геометр өгөгдлөө`
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
                                                :
                                                    <div className="btn-group">
                                                        <button
                                                            type="button mr-2 ml-2"
                                                            onClick={() => this.modalChange(
                                                                'revoke',
                                                                'fa fa-exclamation-circle',
                                                                'warning',
                                                                "Цуцлах",
                                                                DescInput,
                                                                true,
                                                                "цуцлах",
                                                                null
                                                            )}
                                                            className="btn btn-danger waves-effect waves-light"
                                                        >
                                                            <i className="fa fa-times">Цуцлах</i>
                                                        </button>
                                                        <button
                                                            type="button mr-2 ml-2"
                                                            onClick={() => this.modalChange(
                                                                'dismiss',
                                                                'fa fa-exclamation-circle',
                                                                'warning',
                                                                "Буцаах",
                                                                DescInput,
                                                                true,
                                                                "буцаах",
                                                                null
                                                            )}
                                                            className="btn gp-btn-primary waves-effect waves-light"
                                                        >
                                                            <i className="fa fa-check-square-o">Буцаах</i>
                                                        </button>
                                                    </div>
                                            }
                                            <button
                                                type="button mr-2 ml-2"
                                                onClick={() => this.modalChange(
                                                    'approve',
                                                    'fa fa-exclamation-circle',
                                                    'warning',
                                                    "Тохиргоог зөвшөөрөх",
                                                    RefreshView,
                                                    true,
                                                    "зөвшөөрөх",
                                                    null
                                                )}
                                                className="btn gp-btn-outline-primary waves-effect waves-light ml-2"
                                            >
                                                <i className="fa fa-check">Зөвшөөрөх</i>
                                            </button>
                                        </div>
                                }
                             <Loader is_loading={is_loading} text={'Хүсэлтийг шалгаж байна түр хүлээнэ үү...'} />
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
                        getDesc={this.getDesc}
                        getRefViewStatus={this.getRefViewStatus}
                        values = {values}
                    />
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}

function DescInput(props) {
    return (
        <div>
            <label htmlFor="desc">Тайлбар:</label>
            <textarea
                className="form-control"
                id="desc"
                onChange={props.getDesc}
            ></textarea>
        </div>
    )
}



function RefreshView(props) {
    const { values } = props

    return (
        <Fragment>
            <div className="col-md-12 d-flex justify-content-between">
                <div className="col-md-4 my-auto">
                    <label>View шинэчлэлт</label>
                </div>
                <div className="col-md-8 ml-5 mt-3 ">
                    <div className="custom-control custom-radio  ">
                        <input type="radio" className="custom-control-input " onClick={(e) =>{props.getRefViewStatus("Direct", e)}} id="directRef" name="radio-stacked" required/>
                        <label className="custom-control-label float-left pt-1" htmlFor="directRef">Шууд шинэчлэх</label>
                    </div>
                    <div className="custom-control custom-radio  mb-3">
                            <input type="radio" className="custom-control-input " onClick={(e) =>{props.getRefViewStatus("24Hour", e)}} id="24HourRef" name="radio-stacked" required/>
                            <label className="custom-control-label float-left pt-1" htmlFor="24HourRef">24 цагийн дотор шинэчлэх</label>
                    </div>
                </div>
            </div>
            <div className="col-md-12">s
                <small>{
                        `Та ${
                        values.length == 1
                            ?
                                get_modal_text(values[0].kind)
                            :
                        values.length > 1
                            ?
                                `сонгосон ${values.length} геометр өгөгдлөө`
                            :
                            null
                        }
                        зөвшөөрөхдөө итгэлтэй байна уу?`
                    }
                </small>
            </div>
        </Fragment>
    )
}
