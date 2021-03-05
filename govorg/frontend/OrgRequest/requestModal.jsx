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

export const FormJson = ({form_json, handleModalOpen, values}) => {
    return (
        <div className="col-md-4 overflow-auto text-justify" style={{height:"calc( 90vh - 85px - 15px)"}}>
            {
                handleModalOpen
                ?
                <div className="row">
                    <div className="col-md-4">
                        <button
                            className="btn gp-btn-primary"
                            onClick={() => handleModalOpen(
                                'reject',
                                `Та ${
                                    get_modal_text(values.kind)
                                }
                                татгалзахдаа итгэлтэй байна уу ?`,
                                "Тохиргоог татгалзах",
                                "success",
                                " татгалзах"
                            )}
                        >
                            Татгалзах
                        </button>
                    </div>
                    <div className="ml-auto mr-3">
                        <button
                            className="btn gp-btn-outline-primary"
                            onClick={() => handleModalOpen(
                                'approve',
                                `Та ${
                                    get_modal_text(values.kind)
                                }
                                зөвшөөрөхдөө итгэлтэй байна уу ?`,
                                "Тохиргоог зөвшөөрөх",
                                "warning",
                                "зөвшөөрөх"
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
            is_modal_approve_open: false,
            is_modal_reject_open: false,

            modal_status: "closed",
            action_type: '',
            text: '',
            title: '',
            model_type_icon: '',
            action_name: '',

            values: props.values
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.selectedFeature = this.selectedFeature.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
    }

    handleModalClose(){
        this.setState({ modal_status: "closed" })
    }

    handleModalOpen(action_type, text, title, model_type_icon, action_name){

        this.setState({
            modal_status: "open",
            action_type,
            text,
            title,
            model_type_icon,
            action_name
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

        this.setState({ is_loading: true, modal_status: "closed" })
        if(this.state.action_type == 'reject')
        {
           this.handleRequestReject(ids, feature_id)
        }
        if(this.state.action_type == 'approve') {
            this.handleRequestApprove(ids, feature_id)
        }
    }

    handleRequestReject(ids, feature_id,) {
        const open_modal = true
        let modal_info
        let modal_type
        service
            .requestReject(ids, feature_id)
            .then(({ success, info }) => {
                if(success) {
                    modal_type = 'success'
                    modal_info = info
                }
                else {
                    modal_type = 'warning'
                    modal_info = info
                }
                this.setState({ is_loading: false })
                this.props.refreshData(open_modal, modal_info, modal_type)
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    modal_type = 'danger'
                    modal_info = 'Алдаа гарлаа. Обьект олдсонгүй'
                    this.setState({ is_loading: false })
                }
            }).finally(() => this.setState({ status: 'closed' }))
    }

    handleRequestApprove(ids, feature_id){
        const open_modal = true
        let modal_info
        let modal_type
        service
            .requestApprove(ids, feature_id)
            .then(({ success, info }) => {
                if(success) {
                    modal_info = info
                    modal_type = 'success'
                }
                else {
                    modal_info = info
                    modal_type = 'warning'
                }
                this.setState({ is_loading: false })
                this.props.refreshData(open_modal, modal_info, modal_type)
            }).catch((error) => {
                if(error == 'Bad Request')
                {
                    this.setState({ is_loading: false })
                    modal_info = 'Алдаа гарсан байна'
                    modal_type = 'danger'
                    this.props.refreshData(open_modal, modal_info, modal_type)
                }
            }).finally(() => this.setState({ status: 'closed' }))
    }

    componentDidMount() {
        if (this.state.status == "initial") this.handleOpen()
    }

    componentDidUpdate(prevProps) {
        if (this.props.status != prevProps.status) {
            if (["initial", "open"].includes(this.props.status)) {
                this.handleOpen()
            }
            if (["closing", "closed"].includes(this.props.status)) {
                this.handleClose()
            }
        }
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

    render () {

        const selected_form_json = this.state.form_json
        const { is_loading,  modal_status, text, title, model_type_icon, action_name, status, selected_value, values } = this.state
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
                                        <h5 className="text-center text-justify">Хүсэлт шийдвэрлэx</h5>
                                    </div>
                                    <div className="col-md-1" onClick={() => this.handleClose()}>
                                        <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>
                                {
                                    values.length > 0
                                    ?
                                        values.map((value, idx) => {
                                            const { form_json } = value
                                            if (idx == values.length - 1) {
                                                return (
                                                    <div key={idx} className="row">
                                                        {
                                                            values.length == 1
                                                            ?
                                                                form_json && <FormJson form_json={form_json} />
                                                            :
                                                                selected_form_json && <FormJson form_json={selected_form_json} handleModalOpen={this.handleModalOpen} values={selected_value}/>
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
                                <div className="row my-2 mr-1 float-right">
                                    <button
                                        type="button mr-2 ml-2"
                                        onClick={() => this.handleModalOpen(
                                            'reject',
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
                                            татгалзахдаа итгэлтэй байна уу ?`,
                                            "Тохиргоог татгалзах",
                                            "success",
                                            " татгалзах"
                                        )}
                                        className="btn gp-btn-primary waves-effect waves-light"
                                    >
                                        <i className="fa fa-check-square-o">Татгалзах</i>
                                    </button>
                                    <button
                                        type="button mr-2 ml-2"
                                        onClick={() => this.handleModalOpen(
                                            'approve',
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
                                            зөвшөөрөхдөө итгэлтэй байна уу ?`,
                                            "Тохиргоог зөвшөөрөх",
                                            "warning",
                                            "зөвшөөрөх"
                                        )}
                                        className="btn gp-btn-outline-primary waves-effect waves-light ml-2"
                                    >
                                        <i className="fa fa-check">Зөвшөөрөх</i>
                                    </button>
                                </div>
                             <Loader is_loading={is_loading} text={'Хүсэлтийг шалгаж байна түр хүлээнэ үү...'} />
                            </div>
                        </div>
                    </div>
                    <Modal
                        modalAction={() => this.handleModalAction()}
                        modalClose={() => this.handleModalClose()}
                        text={text}
                        title={title}
                        status={modal_status}
                        model_type_icon={model_type_icon}
                        actionNameDelete={action_name}
                    />
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}
